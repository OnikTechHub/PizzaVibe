import { Router, Request, Response } from 'express';
import { Pizza } from '../models/Pizza.js';

const router = Router();

/**
 * @route   GET /api/pizzas
 * @desc    Get all active signature pizzas with populated ingredients
 * @access  Public
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true })
      .populate('defaultBase', 'name price slug dietary')
      .populate('defaultSauce', 'name price slug dietary')
      .populate('defaultCheese', 'name price slug dietary')
      .populate('defaultVeggies', 'name price slug dietary')
      .sort({ rating: -1 });

    res.json({
      success: true,
      count: pizzas.length,
      pizzas,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch pizzas';
    res.status(500).json({ success: false, message });
  }
});

/**
 * @route   GET /api/pizzas/:slug
 * @desc    Get single pizza details by slug
 * @access  Public
 */
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) as string;
    const pizza = await Pizza.findOne({ slug, isAvailable: true })
      .populate('defaultBase')
      .populate('defaultSauce')
      .populate('defaultCheese')
      .populate('defaultVeggies');

    if (!pizza) {
      return res.status(404).json({ success: false, message: 'Pizza not found' });
    }

    res.json({
      success: true,
      pizza,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ success: false, message });
  }
});

export default router;
