'use client';
import { OrderStatus } from '@/types';
import { cn } from '@/utils/cn';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  placed:           { label: 'Order Placed',     color: 'text-blue-400',   bg: 'bg-blue-500/15 border-blue-500/30'   },
  confirmed:        { label: 'Confirmed',         color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
  preparing:        { label: 'Preparing',         color: 'text-amber-400',  bg: 'bg-amber-500/15 border-amber-500/30'  },
  out_for_delivery: { label: 'Out for Delivery',  color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30' },
  delivered:        { label: 'Delivered',         color: 'text-emerald-400',bg: 'bg-emerald-500/15 border-emerald-500/30' },
  cancelled:        { label: 'Cancelled',         color: 'text-red-400',    bg: 'bg-red-500/15 border-red-500/30'     },
};

interface BadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: BadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.placed;
  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
      cfg.bg, cfg.color, className
    )}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {cfg.label}
    </span>
  );
}
