const fs = require('fs');
const path = require('path');

const write = (filepath, content) => {
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, content.trim() + '\n', 'utf8');
};

const src = path.join(__dirname, 'src');

write(path.join(src, 'context', 'LanguageContext.tsx'), \
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ur' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home', about: 'About', menu: 'Menu', gallery: 'Gallery', reviews: 'Reviews', contact: 'Contact',
    orderNow: 'Order Now', exploreMenu: 'Explore Menu', addToCart: 'Add to Cart', checkout: 'Checkout',
    cart: 'Cart', total: 'Total', emptyCart: 'Your cart is empty', placeOrder: 'Place Order',
    success: 'Order Placed Successfully!', whyChooseUs: 'Why Choose Us', featured: 'Featured Dishes'
  },
  ur: {
    home: 'ہوم', about: 'ہمارے بارے میں', menu: 'مینو', gallery: 'گیلری', reviews: 'تبصرے', contact: 'رابطہ',
    orderNow: 'آرڈر کریں', exploreMenu: 'مینو دیکھیں', addToCart: 'کارٹ میں شامل کریں', checkout: 'چیک آؤٹ',
    cart: 'کارٹ', total: 'کل', emptyCart: 'آپ کا کارٹ خالی ہے', placeOrder: 'آرڈر پلیس کریں',
    success: 'آرڈر کامیابی سے ہو گیا!', whyChooseUs: 'ہمیں کیوں چنیں', featured: 'خاص ڈشز'
  },
  ru: {
    home: 'Home', about: 'Hamare Baare Mein', menu: 'Menu', gallery: 'Gallery', reviews: 'Reviews', contact: 'Rabta',
    orderNow: 'Order Karein', exploreMenu: 'Menu Dekhein', addToCart: 'Cart Me Dalein', checkout: 'Checkout',
    cart: 'Cart', total: 'Total', emptyCart: 'Aapka cart khali hai', placeOrder: 'Order Place Karein',
    success: 'Order Kamyabi Se Ho Gaya!', whyChooseUs: 'Humein Kyun Chunein', featured: 'Khas Dishes'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['en', 'ur', 'ru'].includes(saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
\);

write(path.join(src, 'context', 'CartContext.tsx'), \
'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../types';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (menuItem: MenuItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: menuItem.id, menuItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
\);

write(path.join(src, 'types', 'index.ts'), \
export interface MenuItem {
  id: string;
  name: { en: string; ur: string; ru: string };
  description: { en: string; ur: string; ru: string };
  price: number;
  category: string;
  image: string;
}
\);

write(path.join(src, 'app', 'layout.tsx'), \
import './globals.css'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/context/LanguageContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AO Spicy Grill',
  description: 'Taste That Brings Everyone Together',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-gray-100 font-sans">
        <LanguageProvider>
          <CartProvider>
            <Navbar />
            <div className="min-h-screen">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
\);
