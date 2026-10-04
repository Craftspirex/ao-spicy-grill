import { Order, OrderStatus, StatusEvent } from '@/types';

export function generateOrderId(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AO-${datePart}-${rand}`;
}

export function getOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('ao_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): void {
  const orders = getOrders();
  const existing = orders.findIndex(o => o.id === order.id);
  if (existing >= 0) {
    orders[existing] = order;
  } else {
    orders.unshift(order);
  }
  localStorage.setItem('ao_orders', JSON.stringify(orders));
}

export function getOrderById(id: string): Order | null {
  const orders = getOrders();
  return orders.find(o => o.id === id) ?? null;
}

export function updateOrderStatus(orderId: string, status: OrderStatus, description: string): void {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date().toISOString(),
    description,
  });
  localStorage.setItem('ao_orders', JSON.stringify(orders));
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  confirmed: 'Order Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  'placed',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
];
