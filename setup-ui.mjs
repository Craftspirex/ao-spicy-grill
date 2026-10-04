import fs from 'fs';
import path from 'path';

const files = {
  'src/components/Navbar.tsx': `'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              AO SPICY GRILL
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-purple-400 transition-colors">{t('nav.home')}</Link>
            <Link href="/menu" className="hover:text-purple-400 transition-colors">{t('nav.menu')}</Link>
            <Link href="/gallery" className="hover:text-purple-400 transition-colors">Gallery</Link>
            
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent border-none focus:ring-0 text-sm cursor-pointer"
              >
                <option value="en" className="bg-slate-900">EN</option>
                <option value="ur" className="bg-slate-900">UR</option>
                <option value="ru" className="bg-slate-900">RU</option>
              </select>
            </div>

            <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
`,
  'src/components/Footer.tsx': `export default function Footer() {
  return (
    <footer className="glass border-t border-white/10 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-400">
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h2 className="text-2xl font-bold text-white mb-2">AO Spicy Grill</h2>
          <p>Baldia Town, Karachi, Pakistan</p>
          <p className="mt-4">Instagram: @aospicygrill.official</p>
          <p>TikTok: @ao.spicy.grill8</p>
          <p>Facebook: aospicygrill</p>
        </div>
        <div className="text-center md:text-right">
          <p>© 2026 AO Spicy Grill. All Rights Reserved.</p>
          <p className="mt-2 text-sm">A project by ARVÉN</p>
        </div>
      </div>
    </footer>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
