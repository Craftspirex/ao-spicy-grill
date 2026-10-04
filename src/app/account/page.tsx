'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Clock, CheckCircle, DollarSign, ChevronRight, User, MapPin, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { getOrders } from '@/utils/orders';
import { Order } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';

export default function AccountPage() {
  const { user, loggedIn } = useUser();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => { setOrders(getOrders()); }, []);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const latest = orders[0];

  if (!loggedIn || !user) {
    return (
      <div className="min-h-screen px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sign In to View Your Account</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Create a local profile to track orders, save addresses, and speed up checkout.</p>
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl">
          Go Home & Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-gray-400 text-sm">{t('welcomeBack')}</p>
          <h1 className="text-4xl font-black text-white mt-1">
            {user.name} 👋
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { icon: ShoppingBag, label: t('totalOrders'),     val: orders.length,          color: 'from-blue-500 to-blue-600'   },
            { icon: Clock,       label: t('activeOrders'),    val: activeOrders.length,    color: 'from-amber-500 to-orange-600'},
            { icon: CheckCircle, label: t('completedOrders'), val: completedOrders.length, color: 'from-emerald-500 to-green-600'},
            { icon: DollarSign,  label: t('totalSpent'),      val: `Rs ${totalSpent}`,     color: 'from-purple-500 to-purple-600'},
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-black text-white">{s.val}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Order */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-4">{t('latestOrder')}</h2>
            {latest ? (
              <Link href={`/account/orders/${latest.id}`} className="card p-5 flex items-center justify-between gap-4 hover:scale-[1.01] transition-transform block">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-bold">#{latest.id}</span>
                    <StatusBadge status={latest.status} />
                  </div>
                  <p className="text-gray-500 text-sm">{new Date(latest.placedAt).toLocaleDateString()} · {latest.items.length} items</p>
                  <p className="text-blue-400 font-bold mt-1">Rs {latest.total}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
              </Link>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title={t('noOrders')}
                subtitle={t('noOrdersSub')}
                ctaText={t('browseMenu')}
                ctaHref="/#menu"
              />
            )}

            {orders.length > 1 && (
              <Link href="/account/orders" className="mt-4 flex items-center justify-end gap-1 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
                {t('viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Quick Access</h2>
            <div className="space-y-3">
              {[
                { icon: ShoppingBag, label: t('myOrders'),  href: '/account/orders'    },
                { icon: User,        label: t('profile'),   href: '/account/profile'   },
                { icon: MapPin,      label: t('addresses'), href: '/account/addresses' },
                { icon: Settings,    label: t('settings'),  href: '/account/settings'  },
              ].map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href} className="card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform block">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-white font-semibold text-sm">{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
