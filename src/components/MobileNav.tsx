'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { icon: Home,            label: 'Home',   href: '/'        },
  { icon: UtensilsCrossed, label: 'Menu',   href: '/#menu'   },
  { icon: ShoppingCart,    label: 'Cart',   href: '/cart'    },
  { icon: User,            label: 'Account',href: '/account' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="m-3 mb-4 bg-[#0a0f1e]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('#')[0]));
            const isCart = item.href === '/cart';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl transition-all ${
                  isActive ? 'bg-blue-500/15' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                  {isCart && itemCount > 0 && (
                    <AnimatePresence>
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[9px] font-bold flex items-center justify-center"
                      >
                        {itemCount > 9 ? '9+' : itemCount}
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
