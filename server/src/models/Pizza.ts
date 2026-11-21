import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IPizza extends Document {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  image: string;
  isSignature: boolean;
  category: 'artisan-signature' | 'classic' | 'spicy-special' | 'vegan-delight';
  defaultBase: Types.ObjectId;
  defaultSauce: Types.ObjectId;
  defaultCheese: Types.ObjectId;
  defaultVeggies: Types.ObjectId[];
  rating: number;
  reviewsCount: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PizzaSchema = new Schema<IPizza>(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Base price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    isSignature: {
      type: Boolean,
      default: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['artisan-signature', 'classic', 'spicy-special', 'vegan-delight'],
      default: 'artisan-signature',
      index: true,
    },
    defaultBase: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    defaultSauce: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    defaultCheese: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true,
    },
    defaultVeggies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Inventory',
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 120,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pizza: Model<IPizza> =
  mongoose.models.Pizza || mongoose.model<IPizza>('Pizza', PizzaSchema);

export default Pizza;

