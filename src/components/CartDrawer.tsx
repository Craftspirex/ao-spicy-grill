'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingCart, Plus, Minus, Trash2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import ConfirmModal from './ui/ConfirmModal';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, deliveryFee, grandTotal } = useCart();
  const { t, language } = useLanguage();
  const { success, warning } = useToast();
  const router = useRouter();

  const [removeItem, setRemoveItem] = useState<{ id: string; name: string } | null>(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  const handleRemove = (id: string, name: string) => setRemoveItem({ id, name });
  const confirmRemove = () => {
    if (!removeItem) return;
    removeFromCart(removeItem.id);
    success(t('removedFromCart'));
    setRemoveItem(null);
  };

  const handleClear = () => setClearConfirm(true);
  const confirmClear = () => { clearCart(); success(t('cartCleared')); };

  const goToCheckout = () => { onClose(); router.push('/checkout'); };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={onClose}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md flex flex-col bg-[#0a0f1e] border-l border-white/10 shadow-2xl h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">{t('cart')}</h2>
                  {items.length > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                      {items.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-all"
                    >
                      {t('clear')}
                    </button>
                  )}
                  <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-9 h-9 text-gray-600" />
                    </div>
                    <p className="text-white font-semibold mb-1">{t('emptyCart')}</p>
                    <p className="text-gray-500 text-sm mb-6">{t('emptyCartSub')}</p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl text-sm"
                    >
                      {t('browseMenu')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {items.map(item => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                          className="flex gap-4 p-4 bg-white/5 hover:bg-white/[0.07] border border-white/10 rounded-2xl transition-all group"
                        >
                          {/* Color Icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">{getCategoryEmoji(item.menuItem.category)}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-sm truncate">
                              {item.menuItem.name[language as keyof typeof item.menuItem.name] || item.menuItem.name.en}
                            </h4>
                            <p className="text-blue-400 font-bold text-sm mt-0.5">Rs {item.menuItem.price}</p>
                            {/* Qty controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white font-bold text-sm w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <span className="text-gray-500 text-xs ml-2">= Rs {item.menuItem.price * item.quantity}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemove(item.id, item.menuItem.name.en)}
                            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 self-start"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="px-6 py-5 border-t border-white/10 bg-[#0a0f1e]/80 backdrop-blur-sm space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>{t('subtotal')}</span>
                      <span className="text-white font-medium">Rs {subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{t('deliveryFee')}</span>
                      <span className="text-white font-medium">Rs {deliveryFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-white/10">
                      <span className="text-white font-bold text-base">{t('grandTotal')}</span>
                      <span className="text-blue-400 font-bold text-base">Rs {grandTotal}</span>
                    </div>
                  </div>
                  <button
                    onClick={goToCheckout}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    {t('checkout')} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Modals */}
      <ConfirmModal
        open={!!removeItem}
        onClose={() => setRemoveItem(null)}
        onConfirm={confirmRemove}
        title={t('confirmRemove')}
        message={`${removeItem?.name} ${t('confirmRemoveMsg')}`}
        confirmText={t('remove')}
        cancelText={t('cancel')}
      />
      <ConfirmModal
        open={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={confirmClear}
        title={t('confirmClearCart')}
        message={t('confirmClearCartMsg')}
        confirmText={t('clear')}
        cancelText={t('cancel')}
      />
    </>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    'BBQ Mandi': '🍖', 'Starters': '🍲', 'French Fries': '🍟', 'Sides': '🥗',
    'Roll': '🌯', 'Broast': '🍗', 'Katakat': '🫕', 'Sandwiches': '🥪',
    'Burgers': '🍔', 'A.O Bar B.Q': '🔥', 'Royal Handi': '🫕', 'Chicken Karahi': '🍛',
    'Mutton Karahi': '🍛', 'Mutton BBQ': '🥩', 'Chinese': '🍜', 'Rice': '🍚',
    'Dry': '🍲', 'Chowmein': '🍝', 'Beverages': '🥤', 'Tandori': '🫓',
  };
  return map[category] ?? '🍽️';
}
