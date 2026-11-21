import mongoose, { Document, Schema, Model } from 'mongoose';

export type InventoryCategory = 'base' | 'sauce' | 'cheese' | 'veggie' | 'meat';
export type DietaryType = 'veg' | 'non-veg' | 'vegan';

export interface IInventory extends Document {
  category: InventoryCategory;
  name: string;
  slug: string;
  description: string;
  price: number;
  stockQuantity: number;
  threshold: number; // Alerts when stock drops below this level
  unit: string;
  image?: string;
  dietary: DietaryType;
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    category: {
      type: String,
      required: [true, 'Inventory category is required'],
      enum: ['base', 'sauce', 'cheese', 'veggie', 'meat'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 50,
      index: true,
    },
    threshold: {
      type: Number,
      required: [true, 'Low stock threshold is required'],
      min: [1, 'Threshold must be at least 1'],
      default: 10,
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      default: 'portions',
      trim: true,
    },
    image: {
      type: String,
      trim: true,
      default: '',
    },
    dietary: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan'],
      default: 'veg',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-update availability flag based on stock count before save
InventorySchema.pre<IInventory>('save', function () {
  if (this.stockQuantity <= 0) {
    this.isAvailable = false;
  }
});

export const Inventory: Model<IInventory> =
  mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);

export default Inventory;
