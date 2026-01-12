// Order types

import type { CartItem } from "./cart";

export interface Customer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  deliveryNotes?: string;
}

export type OrderType = "pickup" | "delivery";

export interface Order {
  id: string;
  customer: Customer;
  items: CartItem[];
  orderType: OrderType;
  subtotal: number;
  tax: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  createdAt: number;
  notes?: string;
}

export interface OrderFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  orderType: OrderType;
  deliveryNotes?: string;
  notes?: string;
}
