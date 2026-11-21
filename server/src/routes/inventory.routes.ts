import { Router, Request, Response } from 'express';
import { Inventory, InventoryCategory } from '../models/Inventory.js';

const router = Router();

/**
 * @route   GET /api/inventory
 * @desc    Get all available inventory items (grouped by category or flat)
 * @access  Public
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, onlyAvailable } = req.query;
    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    if (onlyAvailable !== 'false') {
      filter.isAvailable = true;
      filter.stockQuantity = { $gt: 0 };
    }

    const items = await Inventory.find(filter).sort({ category: 1, price: 1 });

    // Group items by category for easy consumption by the 4-step builder
    const grouped = {
      bases: items.filter((item) => item.category === 'base'),
      sauces: items.filter((item) => item.category === 'sauce'),
      cheeses: items.filter((item) => item.category === 'cheese'),
      veggies: items.filter((item) => item.category === 'veggie'),
    };

    res.json({
      success: true,
      count: items.length,
      grouped,
      items,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch inventory';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/inventory/:category
 * @desc    Get inventory items by category ('base' | 'sauce' | 'cheese' | 'veggie')
 * @access  Public
 */
router.get('/:category', async (req: Request, res: Response) => {
  try {
    const rawCategory = req.params.category;
    const category = (Array.isArray(rawCategory) ? rawCategory[0] : rawCategory) as InventoryCategory;
    const validCategories: InventoryCategory[] = ['base', 'sauce', 'cheese', 'veggie', 'meat'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
      });
    }

    const items = await Inventory.find({
      category,
      isAvailable: true,
      stockQuantity: { $gt: 0 },
    }).sort({ price: 1 });

    res.json({
      success: true,
      category,
      count: items.length,
      items,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
