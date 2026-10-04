'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu as MenuIcon, X, Globe, User,
  LogOut, ClipboardList, ChevronDown, Flame
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import CartDrawer from './CartDrawer';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { itemCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const { user, loggedIn, logout } = useUser();
  const { success } = useToast();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    success(t('signOut') + '!');
  };

  const navLinks = [
    { label: t('home'),    href: '/'       },
    { label: t('menu'),    href: '/#menu'  },
    { label: t('gallery'), href: '/gallery'},
    { label: t('contact'), href: '/#contact'},
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0f1e]/95 backdrop-blur-xl shadow-xl border-b border-white/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-extrabold text-white tracking-tight">AO SPICY</span>
                <span className="text-lg font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight"> GRILL</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    pathname === l.href ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              {/* Language Switcher */}
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase font-medium">{language}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <div className="absolute right-0 mt-1 w-40 py-1 bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {(['en','ur','ru'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); success(t('languageChanged')); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${language === lang ? 'text-blue-400 font-semibold' : 'text-gray-400'}`}
                    >
                      {lang === 'en' ? '🇺🇸 English' : lang === 'ur' ? '🇵🇰 اردو' : '🌐 Roman Urdu'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Open cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-[10px] font-bold flex items-center justify-center"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Profile / Sign In */}
              {loggedIn && user ? (
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-300 hidden lg:block max-w-24 truncate">{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-52 py-2 bg-[#0f1629] border border-white/10 rounded-2xl shadow-2xl z-50"
                      >
                        <div className="px-4 py-2 border-b border-white/5 mb-1">
                          <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user.phone}</p>
                        </div>
                        <Link href="/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <User className="w-4 h-4" /> {t('account')}
                        </Link>
                        <Link href="/account/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <ClipboardList className="w-4 h-4" /> {t('myOrders')}
                        </Link>
                        <div className="border-t border-white/5 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors">
                            <LogOut className="w-4 h-4" /> {t('signOut')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold transition-all shadow-lg"
                >
                  <User className="w-4 h-4" />
                  {t('signIn')}
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0f1e]/98 backdrop-blur-xl border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-all font-medium"
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-white/5">
                  {loggedIn && user ? (
                    <>
                      <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/5">
                        <User className="w-4 h-4" /> {t('account')}
                      </Link>
                      <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/5">
                        <LogOut className="w-4 h-4" /> {t('signOut')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                    >
                      <User className="w-4 h-4" /> {t('signIn')}
                    </button>
                  )}
                  {/* Language in mobile */}
                  <div className="flex gap-2 mt-3 px-2">
                    {(['en','ur','ru'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => { setLanguage(lang); success(t('languageChanged')); }}
                        className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${language === lang ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                      >
                        {lang === 'en' ? 'EN' : lang === 'ur' ? 'UR' : 'RU'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
