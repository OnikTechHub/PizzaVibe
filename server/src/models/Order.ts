import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'baking'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'razorpay' | 'cod';
export type PizzaSize = 'regular' | 'medium' | 'large';

export interface IOrderItemIngredient {
  id: Types.ObjectId;
  name: string;
  price: number;
}

export interface IOrderItem {
  itemType: 'signature' | 'custom';
  pizzaId?: Types.ObjectId;
  name: string;
  size: PizzaSize;
  base: IOrderItemIngredient;
  sauce: IOrderItemIngredient;
  cheese: IOrderItemIngredient;
  veggies: IOrderItemIngredient[];
  quantity: number;
  unitPrice: number;
  itemTotal: number;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IDeliveryAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  landmark?: string;
}

export interface IOrderPricing {
  subtotal: number;
  tax: number; // 5% GST
  deliveryFee: number;
  total: number;
}

export interface IOrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: Types.ObjectId;
  guestEmail?: string;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  pricing: IOrderPricing;
  payment: IOrderPayment;
  orderStatus: OrderStatus;
  statusTimeline: IOrderStatusHistory[];
  estimatedDeliveryTime: Date;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemIngredientSchema = new Schema<IOrderItemIngredient>(
  {
    id: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemType: {
      type: String,
      enum: ['signature', 'custom'],
      required: true,
      default: 'signature',
    },
    pizzaId: {
      type: Schema.Types.ObjectId,
      ref: 'Pizza',
    },
    name: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ['regular', 'medium', 'large'],
      default: 'regular',
    },
    base: { type: OrderItemIngredientSchema, required: true },
    sauce: { type: OrderItemIngredientSchema, required: true },
    cheese: { type: OrderItemIngredientSchema, required: true },
    veggies: [OrderItemIngredientSchema],
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    itemTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const DeliveryAddressSchema = new Schema<IDeliveryAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    guestEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: [
        (val: IOrderItem[]) => val.length > 0,
        'Order items array cannot be empty',
      ],
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: true,
    },
    pricing: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, required: true, min: 0 },
      deliveryFee: { type: Number, required: true, min: 0, default: 40 },
      total: { type: Number, required: true, min: 0 },
    },
    payment: {
      method: {
        type: String,
        enum: ['razorpay', 'cod'],
        required: true,
        default: 'razorpay',
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        index: true,
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      paidAt: Date,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
    statusTimeline: [
      {
        status: {
          type: String,
          enum: ['placed', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    estimatedDeliveryTime: {
      type: Date,
      required: true,
    },
    deliveredAt: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

