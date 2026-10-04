'use client';
import { useState } from 'react';
import Modal from './ui/Modal';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { useLanguage } from '@/context/LanguageContext';
import { UserProfile } from '@/types';
import { User, Phone, Mail } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useUser();
  const { success, error } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const errs: Partial<typeof form> = {};
    if (!form.name.trim()) errs.name = t('required');
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = t('invalidPhone');
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); error(t('errorForm')); return; }
    const profile: UserProfile = { name: form.name, phone: form.phone, email: form.email };
    login(profile);
    success(`${t('welcomeBack')}, ${form.name}!`);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={t('signIn')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-gray-400 text-sm -mt-2 mb-4">Save your info for faster checkout and order tracking.</p>
        
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('name')}</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: undefined })); }}
              placeholder="Ali Khan"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.name ? 'border-red-500' : 'border-white/10'}`}
            />
          </div>
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('phone')}</label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="tel"
              value={form.phone}
              onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: undefined })); }}
              placeholder="03001234567"
              className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${errors.phone ? 'border-red-500' : 'border-white/10'}`}
            />
          </div>
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('email')} <span className="text-gray-600 normal-case font-normal">(optional)</span></label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="ali@example.com"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg mt-2"
        >
          {t('signIn')}
        </button>
        <p className="text-xs text-center text-gray-600 mt-2">
          This is a local profile — no password needed.
        </p>
      </form>
    </Modal>
  );
}
