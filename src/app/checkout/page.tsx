'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Phone, MapPin, FileText, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { generateOrderId, saveOrder } from '@/utils/orders';
import { startOrderSimulation } from '@/utils/orderSimulation';
import { Order, OrderItem } from '@/types';
import Link from 'next/link';

interface FormState {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, grandTotal, clearCart, updateQuantity } = useCart();
  const { t, language } = useLanguage();
  const { user, addresses } = useUser();
  const { success, error } = useToast();

  const defaultAddress = addresses.find(a => a.isDefault);
  const [form, setForm] = useState<FormState>({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: defaultAddress?.fullAddress ?? '',
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: f.name || user.name, phone: f.phone || user.phone }));
  }, [user]);

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = t('required');
    if (!form.phone.trim() || form.phone.length < 10) e.phone = t('invalidPhone');
    if (!form.address.trim()) e.address = t('required');
    return e;
  };

  const handlePlace = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); error(t('errorForm')); return; }
    if (items.length === 0) { error('Your cart is empty!'); return; }

    setPlacing(true);
    const orderId = generateOrderId();
    const orderItems: OrderItem[] = items.map(i => ({
      menuItemId: i.menuItem.id,
      name: i.menuItem.name.en,
      price: i.menuItem.price,
      quantity: i.quantity,
    }));

    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      customerName: form.name,
      customerPhone: form.phone,
      deliveryAddress: form.address,
      notes: form.notes,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: grandTotal,
      status: 'placed',
      placedAt: now,
      statusHistory: [{ status: 'placed', timestamp: now, description: 'Order received by AO Spicy Grill.' }],
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
    };

    saveOrder(order);
    clearCart();
    startOrderSimulation(orderId);

    await new Promise(r => setTimeout(r, 600)); // slight delay for feel
    success(t('orderSuccess'));
    router.push(`/account/orders/${orderId}`);
  };

  if (items.length === 0 && !placing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-700 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">{t('emptyCart')}</h2>
        <p className="text-gray-500 mb-8">{t('emptyCartSub')}</p>
        <Link href="/#menu" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl">
          {t('browseMenu')}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Finalise</span>
          <h1 className="text-4xl font-black text-white mt-2 mb-10">{t('checkout')}</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" /> {t('customerInfo')}
              </h2>
              <div className="space-y-4">
                <Field
                  icon={<User className="w-4 h-4" />}
                  label={t('name')}
                  value={form.name}
                  onChange={v => { setForm(f => ({ ...f, name: v })); setErrors(e => ({ ...e, name: undefined })); }}
                  error={errors.name}
                  placeholder="Ali Khan"
                />
                <Field
                  icon={<Phone className="w-4 h-4" />}
                  label={t('phone')}
                  value={form.phone}
                  onChange={v => { setForm(f => ({ ...f, phone: v })); setErrors(e => ({ ...e, phone: undefined })); }}
                  error={errors.phone}
                  placeholder="03001234567"
                  type="tel"
                />
                <Field
                  icon={<MapPin className="w-4 h-4" />}
                  label={t('address')}
                  value={form.address}
                  onChange={v => { setForm(f => ({ ...f, address: v })); setErrors(e => ({ ...e, address: undefined })); }}
                  error={errors.address}
                  placeholder="House No., Street, Area, Karachi"
                  multiline
                />
                {/* Saved addresses */}
                {addresses.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Saved addresses:</p>
                    <div className="flex flex-wrap gap-2">
                      {addresses.map(a => (
                        <button
                          key={a.id}
                          onClick={() => setForm(f => ({ ...f, address: a.fullAddress }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.address === a.fullAddress ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                        >
                          {a.label} {a.isDefault && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Field
                  icon={<FileText className="w-4 h-4" />}
                  label={`${t('notes')} (optional)`}
                  value={form.notes}
                  onChange={v => setForm(f => ({ ...f, notes: v }))}
                  placeholder="Special requests, landmarks..."
                  multiline
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-400" /> {t('orderSummary')}
              </h2>
              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                      {getCategoryEmoji(item.menuItem.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-semibold truncate">
                        {item.menuItem.name[language as keyof typeof item.menuItem.name] || item.menuItem.name.en}
                      </p>
                      <p className="text-gray-500 text-xs">Rs {item.menuItem.price} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-white text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-blue-400 font-bold text-sm w-16 text-right">Rs {item.menuItem.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>{t('subtotal')}</span>
                  <span className="text-white">Rs {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{t('deliveryFee')}</span>
                  <span className="text-white">Rs {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
                  <span>{t('grandTotal')}</span>
                  <span className="text-blue-400">Rs {grandTotal}</span>
                </div>
              </div>
            </div>

            <motion.button
              onClick={handlePlace}
              disabled={placing}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {placing ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</span>
              ) : (
                <>{t('placeOrder')} <ChevronRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value, onChange, error, placeholder, type = 'text', multiline = false }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  const baseClass = `w-full pl-10 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none ${error ? 'border-red-500' : 'border-white/10 focus:border-blue-500/40'}`;
  return (
    <div>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="relative mt-1">
        <div className="absolute left-3 top-3.5 text-gray-500">{icon}</div>
        {multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={baseClass} />
        ) : (
          <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={baseClass} />
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
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
