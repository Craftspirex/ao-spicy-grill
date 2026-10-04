import { Order, OrderStatus } from '@/types';
import { updateOrderStatus, getOrderById } from './orders';

interface SimulationStep {
  status: OrderStatus;
  delay: number; // ms
  description: string;
}

const SIMULATION_STEPS: SimulationStep[] = [
  { status: 'confirmed', delay: 15000, description: 'Your order has been confirmed by the restaurant.' },
  { status: 'preparing', delay: 60000, description: 'Our chefs are preparing your delicious meal.' },
  { status: 'out_for_delivery', delay: 180000, description: 'Your order is on its way!' },
  { status: 'delivered', delay: 360000, description: 'Your order has been delivered. Enjoy your meal!' },
];

export function startOrderSimulation(orderId: string): void {
  let cumulativeDelay = 0;

  for (const step of SIMULATION_STEPS) {
    cumulativeDelay += step.delay;
    setTimeout(() => {
      const order = getOrderById(orderId);
      if (!order || order.status === 'cancelled') return;
      updateOrderStatus(orderId, step.status, step.description);
      // Dispatch custom event so UI can react
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orderStatusUpdate', { detail: { orderId, status: step.status } }));
      }
    }, cumulativeDelay);
  }
}
