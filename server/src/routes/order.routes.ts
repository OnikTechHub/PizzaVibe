import { Router, Request, Response } from 'express';
import { Order } from '../models/Order.js';

const router = Router();

/**
 * Helper to generate order number: PC-YYYYMM-XXXX
 */
const generateOrderNumber = () => {
  const date = new Date();
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PC-${yearMonth}-${randomSuffix}`;
};

/**
 * @route   POST /api/orders
 * @desc    Create a new pizza order
 * @access  Public (Guest or Logged-in User)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes, userId, guestEmail } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Order must contain items' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.street || !deliveryAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete delivery address and contact phone are required',
      });
    }

    // Calculate subtotal from items
    const subtotal = items.reduce(
      (sum: number, item: { itemTotal?: number; unitPrice: number; quantity: number }) =>
        sum + (item.itemTotal || item.unitPrice * item.quantity),
      0
    );

    const tax = Math.round(subtotal * 0.05); // 5% GST
    const deliveryFee = subtotal > 600 ? 0 : 40; // Free delivery over ₹600
    const total = subtotal + tax + deliveryFee;

    const orderNumber = generateOrderNumber();
    const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 mins from now

    const order = await Order.create({
      orderNumber,
      user: userId || undefined,
      guestEmail: guestEmail || undefined,
      items,
      deliveryAddress,
      pricing: {
        subtotal,
        tax,
        deliveryFee,
        total,
      },
      payment: {
        method: paymentMethod || 'cod',
        status: paymentMethod === 'cod' ? 'pending' : 'pending',
      },
      orderStatus: 'placed',
      statusTimeline: [
        {
          status: 'placed',
          timestamp: new Date(),
          note: 'Order successfully received by PizzaVibe Kitchen',
        },
      ],
      estimatedDeliveryTime,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to place order';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order details for real-time tracking and invoice
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = (Array.isArray(rawId) ? rawId[0] : rawId) as string;

    // Search by orderNumber or MongoDB _id
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const order = isObjectId
      ? await Order.findById(id)
      : await Order.findOne({ orderNumber: id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get order list (filtered by user or recent)
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.query;
    const filter: Record<string, unknown> = {};

    if (userId) filter.user = userId;
    if (email) filter.guestEmail = email;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    res.status(500).json({ success: false, message });
  }
});

export default router;
