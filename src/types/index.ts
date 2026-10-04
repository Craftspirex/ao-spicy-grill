export type Language = 'en' | 'ur' | 'ru';

export interface MenuItem {
  id: string;
  name: { en: string; ur: string; ru: string };
  description: { en: string; ur: string; ru: string };
  price: number;
  category: string;
  image?: string;
  popular?: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  placedAt: string;
  statusHistory: StatusEvent[];
  estimatedDelivery?: string;
}

export interface StatusEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Address {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  fullAddress: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  defaultAddressId?: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
