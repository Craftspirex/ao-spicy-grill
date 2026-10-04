import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { UserProvider } from '@/context/UserContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'AO Spicy Grill | Taste That Brings Everyone Together',
  description:
    'Premium restaurant in Baldia Town, Karachi. Authentic BBQ, Karahi, Handi, and more. Order online now.',
  keywords: 'AO Spicy Grill, Baldia Town, Karachi restaurant, BBQ, Karahi, order online, Pakistani food',
  openGraph: {
    title: 'AO Spicy Grill',
    description: 'Taste That Brings Everyone Together',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#0a0f1e] text-white">
        <LanguageProvider>
          <ToastProvider>
            <UserProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1 pt-20 pb-24 md:pb-0">{children}</main>
                <Footer />
                <MobileNav />
              </CartProvider>
            </UserProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
