'use client';
import { MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black text-gray-400 pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 lg:col-span-1">
            <h2 className="text-2xl font-extrabold text-white tracking-tighter mb-6">
              AO SPICY <span className="text-red-500">GRILL</span>
            </h2>
            <p className="mb-6 leading-relaxed">
              Serving the most authentic and delicious traditional Pakistani cuisine, BBQ, and fast food in Baldia Town.
            </p>
            <div className="flex space-x-4">
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><a href="#home" className="hover:text-red-500 transition-colors">{t('home')}</a></li>
              <li><a href="#about" className="hover:text-red-500 transition-colors">{t('about')}</a></li>
              <li><a href="#menu" className="hover:text-red-500 transition-colors">{t('menu')}</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition-colors">{t('contact')}</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <span>Baldia Town, Karachi, Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <span>+92 300 0000000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <span>info@aospicygrill.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-6">Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Monday - Thursday</span>
                <span className="text-white">12:00 PM - 1:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Friday</span>
                <span className="text-white">2:00 PM - 2:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-gray-800 pb-2">
                <span>Sat - Sun</span>
                <span className="text-white">12:00 PM - 2:00 AM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} AO Spicy Grill. All Rights Reserved.</p>
          <p className="mt-4 md:mt-0">A project by <span className="text-white font-bold tracking-wider">ARVÉN</span></p>
        </div>
      </div>
    </footer>
  );
}
