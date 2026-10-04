'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShoppingCart, Star, MapPin, Clock, Phone,
  ChevronRight, Flame, Award, Truck, Heart,
  ChevronDown, Search
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { menuItems } from '@/data/menu';

const FEATURED_IDS = ['39', '52', '60', '36', '83', '78']; // Mega Zinger, Shashlik, Chicken Handi, Zinger Burger, Mutton Karahi, Biryani

const REVIEWS = [
  { name: 'Asad Raza', rating: 5, text: 'Best BBQ in Baldia Town! The Chicken Tikka is absolutely amazing. Must try!', date: '2 days ago' },
  { name: 'Sana Malik', rating: 5, text: 'Ordered the Full Mandi for a family gathering — everyone loved it. Authentic taste!', date: '1 week ago' },
  { name: 'Omar Khan', rating: 4, text: 'Great food and quick delivery. The Karahi was excellent. Highly recommended.', date: '2 weeks ago' },
];

const WHY_US = [
  { icon: Flame,  title: '100% Halal',     desc: 'All our meat is certified halal, prepared with the finest ingredients.' },
  { icon: Award,  title: 'Premium Quality', desc: '120+ dishes crafted by expert chefs using authentic spices and recipes.' },
  { icon: Truck,  title: 'Fast Delivery',   desc: 'Hot food delivered to your doorstep quickly and efficiently.' },
  { icon: Heart,  title: 'Family Favorite', desc: 'Trusted by thousands of families in Karachi since day one.' },
];

export default function Home() {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { success } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(menuItems.map(i => i.category)))];
  const featured = FEATURED_IDS.map(id => menuItems.find(i => i.id === id)).filter(Boolean) as typeof menuItems;

  const filteredItems = menuItems
    .filter(i => selectedCategory === 'All' || i.category === selectedCategory)
    .filter(i => !search || i.name.en.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = (item: (typeof menuItems)[0]) => {
    addToCart(item);
    success(`${item.name.en} ${t('addedToCart')}`);
  };

  return (
    <main className="bg-[#0a0f1e] text-white overflow-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[100svh] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80"
            alt="AO Spicy Grill"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e]/70 via-[#0a0f1e]/50 to-[#0a0f1e]" />
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-blue-600/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8"
          >
            <Flame className="w-4 h-4" />
            Baldia Town's Premium Restaurant
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none"
          >
            <span className="text-white">AO SPICY</span>
            <br />
            <span className="gradient-text">GRILL</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl sm:text-2xl text-gray-300 mb-10 font-light"
          >
            Taste That Brings Everyone Together
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:scale-105"
            >
              {t('orderNow')}
            </button>
            <Link
              href="#about"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/10 hover:border-white/20 transition-all"
            >
              {t('exploreMenu')}
            </Link>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-6 h-6 text-gray-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: '120+', label: 'Menu Items'    },
              { val: '5K+',  label: 'Orders Served' },
              { val: '20',   label: 'Categories'    },
              { val: '4.9★', label: 'Avg Rating'    },
            ].map((s, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-black gradient-text">{s.val}</p>
                <p className="text-gray-500 text-sm mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 leading-tight">
              {t('about')} <span className="gradient-text">AO Spicy Grill</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Experience the authentic taste of Pakistani cuisine with our wide range of BBQ, Karahi, Handi, 
              and fast food options. We use only the freshest ingredients and traditional spices to bring 
              you a dining experience you won't forget.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[['100%', 'Fresh Ingredients'], ['120+', 'Menu Items'], ['20+', 'Categories'], ['5K+', 'Happy Customers']].map(([val, lbl]) => (
                <div key={lbl} className="p-4 card">
                  <p className="text-2xl font-black gradient-text">{val}</p>
                  <p className="text-gray-500 text-sm mt-1">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" alt="BBQ Grill" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4">
              <p className="text-white font-bold">A Project by ARVÉN</p>
              <p className="text-gray-400 text-sm">Baldia Town, Karachi</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Our Promise</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3">{t('whyChooseUs')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="card p-6 hover:scale-[1.02] transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED DISHES ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Chef's Pick</span>
              <h2 className="text-4xl font-black mt-2">{t('featured')}</h2>
            </div>
            <button onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">
              {t('viewAll')} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item, i) => (
              <motion.div
                key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="card p-5 group hover:scale-[1.01] transition-transform"
              >
                <div className="h-40 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center mb-4 text-5xl">
                  {getCategoryEmoji(item.category)}
                </div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{item.name.en}</h3>
                  <span className="text-blue-400 font-black text-lg whitespace-nowrap">Rs {item.price}</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">{item.category}</p>
                <button
                  onClick={() => handleAdd(item)}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 border border-white/10 hover:border-transparent text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingCart className="w-4 h-4" /> {t('addToCart')}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FULL MENU ═══ */}
      <section id="menu" ref={menuRef} className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Our Food</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-2">{t('menu')}</h2>
            <p className="text-gray-500">120+ dishes across 20 categories</p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No items found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id} layout
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="card p-5 flex justify-between items-center gap-4 group hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-600/15 border border-white/10 flex items-center justify-center flex-shrink-0 text-2xl">
                      {getCategoryEmoji(item.category)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold text-sm leading-tight truncate">
                        {item.name[language as keyof typeof item.name] || item.name.en}
                      </h3>
                      <p className="text-gray-600 text-xs mt-0.5">{item.category}</p>
                      <p className="text-blue-400 font-bold mt-1">Rs {item.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAdd(item)}
                    className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600 border border-white/10 hover:border-transparent text-gray-400 hover:text-white flex items-center justify-center transition-all"
                    aria-label={`Add ${item.name.en} to cart`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ REVIEWS ═══ */}
      <section id="reviews" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
            <h2 className="text-4xl font-black mt-3">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className="flex mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {r.name.charAt(0)}
                    </div>
                    <span className="text-white font-semibold text-sm">{r.name}</span>
                  </div>
                  <span className="text-gray-600 text-xs">{r.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Find Us</span>
            <h2 className="text-4xl font-black mt-3">{t('contact')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'Location', content: 'Baldia Town, Karachi, Pakistan' },
              { icon: Clock, title: 'Hours', content: 'Mon–Sun: 12:00 PM – 2:00 AM' },
              { icon: Phone, title: 'Social', content: 'IG: @aospicygrill.official\nTikTok: @ao.spicy.grill8' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="card p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                  <p className="text-gray-400 text-sm whitespace-pre-line">{card.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </main>
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
