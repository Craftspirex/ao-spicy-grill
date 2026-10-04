'use client';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_SEQUENCE } from '@/utils/orders';
import { Check, Clock, ChefHat, Bike, PartyPopper } from 'lucide-react';
import { cn } from '@/utils/cn';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory?: { status: OrderStatus; timestamp: string; description: string }[];
}

const STEP_CONFIG = [
  { status: 'placed'           as OrderStatus, label: 'Order Placed',     icon: Clock,       desc: 'We received your order' },
  { status: 'confirmed'        as OrderStatus, label: 'Confirmed',         icon: Check,       desc: 'Restaurant confirmed' },
  { status: 'preparing'        as OrderStatus, label: 'Preparing',         icon: ChefHat,     desc: 'Chefs are cooking' },
  { status: 'out_for_delivery' as OrderStatus, label: 'Out for Delivery',  icon: Bike,        desc: 'Rider is on the way' },
  { status: 'delivered'        as OrderStatus, label: 'Delivered',         icon: PartyPopper, desc: 'Enjoy your meal!' },
];

export default function OrderTimeline({ currentStatus, statusHistory = [] }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-xl">✕</span>
        </div>
        <div>
          <p className="text-red-400 font-semibold">Order Cancelled</p>
          <p className="text-gray-500 text-sm">This order has been cancelled.</p>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_SEQUENCE.indexOf(currentStatus);

  return (
    <div className="relative">
      {STEP_CONFIG.map((step, idx) => {
        const Icon = step.icon;
        const isDone = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isPending = idx > currentIdx;
        const historyEntry = statusHistory.find(h => h.status === step.status);

        return (
          <div key={step.status} className="flex gap-4 relative">
            {/* Connector line */}
            {idx < STEP_CONFIG.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-full -translate-x-1/2">
                <div className={cn(
                  'w-full transition-all duration-700',
                  isDone || isCurrent ? 'bg-gradient-to-b from-blue-500 to-purple-500 h-full' : 'bg-white/5 h-full'
                )} />
              </div>
            )}

            {/* Icon */}
            <div className={cn(
              'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500',
              isDone    && 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/30',
              isCurrent && 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400 ring-4 ring-blue-500/20',
              isPending && 'bg-white/5 border-white/10'
            )}>
              <Icon className={cn(
                'w-4 h-4',
                isDone    && 'text-white',
                isCurrent && 'text-blue-400',
                isPending && 'text-gray-600'
              )} />
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <p className={cn(
                'font-semibold text-sm',
                isDone    && 'text-gray-300',
                isCurrent && 'text-white',
                isPending && 'text-gray-600'
              )}>
                {step.label}
              </p>
              <p className={cn(
                'text-xs mt-0.5',
                isPending ? 'text-gray-700' : 'text-gray-500'
              )}>
                {historyEntry
                  ? new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : step.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
