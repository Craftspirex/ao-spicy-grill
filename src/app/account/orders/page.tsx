'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import { getOrders } from '@/utils/orders';
import { Order } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    setOrders(getOrders());

    const onUpdate = () => setOrders(getOrders());
    window.addEventListener('orderStatusUpdate', onUpdate);
    return () => window.removeEventListener('orderStatusUpdate', onUpdate);
  }, []);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/account" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> {t('account')}
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">History</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-8">{t('myOrders')}</h1>
        </motion.div>

        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={t('noOrders')}
            subtitle={t('noOrdersSub')}
            ctaText={t('browseMenu')}
            ctaHref="/#menu"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/account/orders/${order.id}`} className="card p-5 flex items-center gap-4 hover:scale-[1.005] transition-transform block">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-600/15 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-white font-bold text-sm">#{order.id}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-gray-500 text-xs">
                      {new Date(order.placedAt).toLocaleDateString()} · {order.items.length} {t('items')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-blue-400 font-bold">Rs {order.total}</p>
                    <ChevronRight className="w-4 h-4 text-gray-600 mt-1 ml-auto" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
