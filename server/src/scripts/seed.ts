import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Inventory, Pizza } from '../models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pizzavibe';

export async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to database successfully.');

    // 1. Clear existing inventory and pizza collections
    console.log('[Seed] Resetting Inventory and Pizza collections...');
    await Inventory.deleteMany({});
    await Pizza.deleteMany({});

    // 2. Seed Base Crusts
    console.log('[Seed] Seeding pizza bases...');
    const bases = await Inventory.insertMany([
      {
        category: 'base',
        name: 'Classic Neapolitan Sourdough',
        slug: 'classic-neapolitan-sourdough',
        description: '48-hour slow fermented dough with airy charred cornicione and delicate sourdough tang.',
        price: 180,
        stockQuantity: 100,
        threshold: 15,
        unit: 'crusts',
        dietary: 'veg',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'base',
        name: 'Crisp Roman Thin Crust',
        slug: 'crisp-roman-thin-crust',
        description: 'Extra-thin, crispy stone-fired dough rolled with Italian semolina for ultimate crunch.',
        price: 160,
        stockQuantity: 80,
        threshold: 12,
        unit: 'crusts',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'base',
        name: 'Garlic Butter Herb Stuffed Crust',
        slug: 'garlic-butter-stuffed-crust',
        description: 'Fluffy golden crust stuffed with molten herb mozzarella and brushed with roasted garlic butter.',
        price: 220,
        stockQuantity: 60,
        threshold: 10,
        unit: 'crusts',
        dietary: 'veg',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'base',
        name: 'Whole Wheat Rustic Crust',
        slug: 'whole-wheat-rustic-crust',
        description: 'Stone-ground 100% whole grain wheat flour with sunflower and flax seeds.',
        price: 170,
        stockQuantity: 70,
        threshold: 10,
        unit: 'crusts',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'base',
        name: 'Gluten-Free Cauliflower & Almond Crust',
        slug: 'gluten-free-cauliflower-crust',
        description: 'Guilt-free crispy base baked with cauliflower pearls, almond flour, and parmesan.',
        price: 240,
        stockQuantity: 50,
        threshold: 8,
        unit: 'crusts',
        dietary: 'veg',
        isAvailable: true,
      },
    ]);

    // 3. Seed Sauces
    console.log('[Seed] Seeding sauces...');
    const sauces = await Inventory.insertMany([
      {
        category: 'sauce',
        name: 'San Marzano Tomato D.O.P.',
        slug: 'san-marzano-tomato-dop',
        description: 'Sweet Italian volcanic plum tomatoes crushed with sea salt, cold-pressed olive oil, and sweet basil.',
        price: 70,
        stockQuantity: 150,
        threshold: 20,
        unit: 'ladles',
        dietary: 'vegan',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'sauce',
        name: 'Spicy Calabrian Arrabbiata',
        slug: 'spicy-calabrian-arrabbiata',
        description: 'Slow-simmered tomato sauce infused with fiery Calabrian chili peppers and roasted garlic.',
        price: 80,
        stockQuantity: 120,
        threshold: 15,
        unit: 'ladles',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'sauce',
        name: 'Genovese Basil Pesto',
        slug: 'genovese-basil-pesto',
        description: 'Fragrant fresh Ligurian basil blended with toasted pine nuts, garlic, and cold-pressed EVOO.',
        price: 95,
        stockQuantity: 90,
        threshold: 15,
        unit: 'ladles',
        dietary: 'veg',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'sauce',
        name: 'Creamy White Truffle Alfredo',
        slug: 'creamy-white-truffle-alfredo',
        description: 'Velvety cream sauce infused with real Italian white truffle essence and aged parmesan.',
        price: 110,
        stockQuantity: 80,
        threshold: 12,
        unit: 'ladles',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'sauce',
        name: 'Smokey Bourbon BBQ Glaze',
        slug: 'smokey-bourbon-bbq-glaze',
        description: 'Rich, tangy slow-simmered molasses BBQ glaze finished with smoked paprika.',
        price: 75,
        stockQuantity: 100,
        threshold: 15,
        unit: 'ladles',
        dietary: 'vegan',
        isAvailable: true,
      },
    ]);

    // 4. Seed Cheeses
    console.log('[Seed] Seeding cheeses...');
    const cheeses = await Inventory.insertMany([
      {
        category: 'cheese',
        name: 'Fresh Fior di Latte Mozzarella',
        slug: 'fresh-fior-di-latte-mozzarella',
        description: 'Creamy fresh artisan cow milk mozzarella with unmatched stretch and gentle sweetness.',
        price: 110,
        stockQuantity: 140,
        threshold: 20,
        unit: 'portions',
        dietary: 'veg',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'cheese',
        name: 'Smoked Gouda & Provolone Blend',
        slug: 'smoked-gouda-provolone-blend',
        description: 'Natural beechwood-smoked Dutch gouda blended with sharp aged provolone.',
        price: 125,
        stockQuantity: 95,
        threshold: 15,
        unit: 'portions',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'cheese',
        name: 'Aged Parmigiano-Reggiano D.O.P.',
        slug: 'aged-parmigiano-reggiano',
        description: '24-month cave-aged Italian parmesan with rich umami crystals and nutty finish.',
        price: 140,
        stockQuantity: 75,
        threshold: 12,
        unit: 'portions',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'cheese',
        name: 'Whipped Ricotta & Herb Pecorino',
        slug: 'whipped-ricotta-pecorino',
        description: 'Airy clouds of sweet whey ricotta blended with sea salt and cracked black pepper.',
        price: 115,
        stockQuantity: 85,
        threshold: 12,
        unit: 'portions',
        dietary: 'veg',
        isAvailable: true,
      },
      {
        category: 'cheese',
        name: 'Dairy-Free Cashew Mozzarella',
        slug: 'dairy-free-cashew-mozzarella',
        description: '100% plant-based cultured cashew cream cheese that melts and bubbles perfectly.',
        price: 130,
        stockQuantity: 60,
        threshold: 10,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
    ]);

    // 5. Seed Veggies & Toppings
    console.log('[Seed] Seeding veggies and toppings...');
    const veggies = await Inventory.insertMany([
      {
        category: 'veggie',
        name: 'Roasted Campari Tomatoes',
        slug: 'roasted-campari-tomatoes',
        description: 'Sweet vine-ripened tomatoes slow-roasted with balsamic glaze and sea salt.',
        price: 45,
        stockQuantity: 120,
        threshold: 15,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'veggie',
        name: 'Wild Forest Mushrooms',
        slug: 'wild-forest-mushrooms',
        description: 'Sautéed medley of cremini, shiitake, and portobello with garlic thyme butter.',
        price: 60,
        stockQuantity: 110,
        threshold: 15,
        unit: 'portions',
        dietary: 'veg',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'veggie',
        name: 'Caramelized Sweet Onions',
        slug: 'caramelized-sweet-onions',
        description: 'Slow-braised golden brown sweet onions with balsamic drizzle.',
        price: 40,
        stockQuantity: 130,
        threshold: 15,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'veggie',
        name: 'Charred Bell Peppers',
        slug: 'charred-bell-peppers',
        description: 'Flame-roasted sweet red and yellow bell pepper strips.',
        price: 45,
        stockQuantity: 100,
        threshold: 15,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'veggie',
        name: 'Kalamata Black Olives',
        slug: 'kalamata-black-olives',
        description: 'Sun-ripened Greek Kalamata olive rings marinated in wild oregano.',
        price: 50,
        stockQuantity: 90,
        threshold: 12,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'veggie',
        name: 'Fresh Genovese Basil Leaves',
        slug: 'fresh-genovese-basil-leaves',
        description: 'Aromatic whole organic sweet basil leaves added fresh after baking.',
        price: 30,
        stockQuantity: 150,
        threshold: 20,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
        isFeatured: true,
      },
      {
        category: 'veggie',
        name: 'Pickled Jalapeño Coins',
        slug: 'pickled-jalapeno-coins',
        description: 'Crisp spicy jalapeño pepper slices with apple cider tang.',
        price: 40,
        stockQuantity: 95,
        threshold: 12,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
      {
        category: 'veggie',
        name: 'Tender Baby Spinach',
        slug: 'tender-baby-spinach',
        description: 'Fresh farm-picked organic baby spinach leaves.',
        price: 35,
        stockQuantity: 100,
        threshold: 15,
        unit: 'portions',
        dietary: 'vegan',
        isAvailable: true,
      },
    ]);

    // Map items for easy reference in Signature Pizzas
    const baseMap = new Map(bases.map((b) => [b.slug, b._id]));
    const sauceMap = new Map(sauces.map((s) => [s.slug, s._id]));
    const cheeseMap = new Map(cheeses.map((c) => [c.slug, c._id]));
    const veggieMap = new Map(veggies.map((v) => [v.slug, v._id]));

    // 6. Seed Signature Pizzas
    console.log('[Seed] Seeding artisan signature pizzas...');
    await Pizza.insertMany([
      {
        name: 'Truffle Formaggio Royale',
        slug: 'truffle-formaggio-royale',
        description: 'Earthy white truffle cream over 48-hr sourdough, topped with molten fior di latte, thyme sautéed forest mushrooms, and aged parmesan.',
        basePrice: 549,
        image: '/images/pizzas/truffle-royale.jpg',
        isSignature: true,
        category: 'artisan-signature',
        defaultBase: baseMap.get('classic-neapolitan-sourdough'),
        defaultSauce: sauceMap.get('creamy-white-truffle-alfredo'),
        defaultCheese: cheeseMap.get('fresh-fior-di-latte-mozzarella'),
        defaultVeggies: [
          veggieMap.get('wild-forest-mushrooms'),
          veggieMap.get('fresh-genovese-basil-leaves'),
        ],
        rating: 4.9,
        reviewsCount: 384,
        isAvailable: true,
      },
      {
        name: 'Spicy Calabrian Arrabbiata Fire',
        slug: 'spicy-calabrian-arrabbiata-fire',
        description: 'Fire-roasted Roman thin crust with spicy Calabrian pepper sauce, molten fior di latte, charred bell peppers, and zesty jalapeño coins.',
        basePrice: 479,
        image: '/images/pizzas/calabrian-diavola.jpg',
        isSignature: true,
        category: 'spicy-special',
        defaultBase: baseMap.get('crisp-roman-thin-crust'),
        defaultSauce: sauceMap.get('spicy-calabrian-arrabbiata'),
        defaultCheese: cheeseMap.get('fresh-fior-di-latte-mozzarella'),
        defaultVeggies: [
          veggieMap.get('charred-bell-peppers'),
          veggieMap.get('pickled-jalapeno-coins'),
          veggieMap.get('caramelized-sweet-onions'),
        ],
        rating: 4.8,
        reviewsCount: 295,
        isAvailable: true,
      },
      {
        name: 'Pesto Verde Genovese',
        slug: 'pesto-verde-genovese',
        description: 'Garlic butter herb crust generously topped with Ligurian basil pesto, fluffy whipped ricotta, sweet roasted Campari tomatoes, and baby spinach.',
        basePrice: 499,
        image: '/images/pizzas/pesto-genovese.jpg',
        isSignature: true,
        category: 'artisan-signature',
        defaultBase: baseMap.get('garlic-butter-stuffed-crust'),
        defaultSauce: sauceMap.get('genovese-basil-pesto'),
        defaultCheese: cheeseMap.get('whipped-ricotta-pecorino'),
        defaultVeggies: [
          veggieMap.get('roasted-campari-tomatoes'),
          veggieMap.get('tender-baby-spinach'),
        ],
        rating: 4.9,
        reviewsCount: 260,
        isAvailable: true,
      },
      {
        name: 'Margherita Antica',
        slug: 'margherita-antica',
        description: 'The timeless classic. San Marzano D.O.P. tomato sauce, fresh artisan fior di latte mozzarella, fragrant sweet basil leaves, and cold-pressed extra virgin olive oil.',
        basePrice: 429,
        image: '/images/pizzas/margherita-antica.jpg',
        isSignature: true,
        category: 'classic',
        defaultBase: baseMap.get('classic-neapolitan-sourdough'),
        defaultSauce: sauceMap.get('san-marzano-tomato-dop'),
        defaultCheese: cheeseMap.get('fresh-fior-di-latte-mozzarella'),
        defaultVeggies: [veggieMap.get('fresh-genovese-basil-leaves')],
        rating: 4.95,
        reviewsCount: 512,
        isAvailable: true,
      },
      {
        name: 'Smokey Rustic Harvest',
        slug: 'smokey-rustic-harvest',
        description: 'Whole wheat artisan crust brushed with smokey bourbon BBQ glaze, smoked gouda, balsamic caramelized onions, and wild forest mushrooms.',
        basePrice: 519,
        image: '/images/pizzas/smokey-bbq.jpg',
        isSignature: true,
        category: 'artisan-signature',
        defaultBase: baseMap.get('whole-wheat-rustic-crust'),
        defaultSauce: sauceMap.get('smokey-bourbon-bbq-glaze'),
        defaultCheese: cheeseMap.get('smoked-gouda-provolone-blend'),
        defaultVeggies: [
          veggieMap.get('caramelized-sweet-onions'),
          veggieMap.get('wild-forest-mushrooms'),
          veggieMap.get('kalamata-black-olives'),
        ],
        rating: 4.85,
        reviewsCount: 310,
        isAvailable: true,
      },
      {
        name: 'Vegan Bella Verde',
        slug: 'vegan-bella-verde',
        description: 'Gluten-free cauliflower crust with San Marzano tomatoes, plant-based cashew mozzarella melt, roasted Campari tomatoes, black olives, and fresh basil.',
        basePrice: 539,
        image: '/images/pizzas/vegan-bella.jpg',
        isSignature: true,
        category: 'vegan-delight',
        defaultBase: baseMap.get('gluten-free-cauliflower-crust'),
        defaultSauce: sauceMap.get('san-marzano-tomato-dop'),
        defaultCheese: cheeseMap.get('dairy-free-cashew-mozzarella'),
        defaultVeggies: [
          veggieMap.get('roasted-campari-tomatoes'),
          veggieMap.get('kalamata-black-olives'),
          veggieMap.get('fresh-genovese-basil-leaves'),
        ],
        rating: 4.8,
        reviewsCount: 185,
        isAvailable: true,
      },
    ]);

    console.log('----------------------------------------------------');
    console.log('✅ PizzaVibe Database Seeding Completed Successfully!');
    console.log('   - 5 Dough Bases seeded');
    console.log('   - 5 Gourmet Sauces seeded');
    console.log('   - 5 Artisan Cheeses seeded');
    console.log('   - 8 Fresh Veggies & Toppings seeded');
    console.log('   - 6 Signature Handcrafted Pizzas seeded');
    console.log('----------------------------------------------------');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Auto-run if executed directly
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}

