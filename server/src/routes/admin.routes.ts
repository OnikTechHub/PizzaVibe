import { Router, Request, Response } from 'express';
import { Inventory } from '../models/Inventory.js';
import { Order, OrderStatus } from '../models/Order.js';
import { protect, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Protect all admin endpoints with database-driven role verification
router.use(protect);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/stats
 * @desc    Get dashboard metrics & telemetry
 * @access  Admin (Database role: 'admin')
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeOrders = await Order.countDocuments({
      orderStatus: { $in: ['placed', 'confirmed', 'baking', 'out_for_delivery'] },
    });

    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$stockQuantity', '$threshold'] },
    });

    const revenueResult = await Order.aggregate([
      { $match: { 'payment.status': { $in: ['completed', 'pending'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        activeOrders,
        lowStockCount: lowStockItems.length,
        totalRevenue,
      },
      lowStockAlerts: lowStockItems,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/admin/inventory
 * @desc    Get full inventory with stock thresholds
 * @access  Admin (Database role: 'admin')
 */
router.get('/inventory', async (_req: Request, res: Response) => {
  try {
    const items = await Inventory.find().sort({ category: 1, stockQuantity: 1 });
    res.json({ success: true, count: items.length, items });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   PATCH /api/admin/inventory/:id/stock
 * @desc    Update stock quantity for an ingredient
 * @access  Admin (Database role: 'admin')
 */
router.patch('/inventory/:id/stock', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) as string;
    const { stockQuantity } = req.body;

    if (stockQuantity === undefined || stockQuantity < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock quantity' });
    }

    const item = await Inventory.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item.stockQuantity = stockQuantity;
    item.isAvailable = stockQuantity > 0;
    await item.save();

    res.json({
      success: true,
      message: `Updated stock for ${item.name}`,
      item,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   PATCH /api/admin/orders/:id/status
 * @desc    Update order kitchen/delivery status
 * @access  Admin (Database role: 'admin')
 */
router.patch('/orders/:id/status', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) as string;
    const { status, note } = req.body as { status: OrderStatus; note?: string };

    const validStatuses: OrderStatus[] = [
      'placed',
      'confirmed',
      'baking',
      'out_for_delivery',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.payment.status = 'completed';
    }

    order.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
