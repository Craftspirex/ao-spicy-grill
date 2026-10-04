'use client';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  onCta?: () => void;
}

export default function EmptyState({ icon: Icon, title, subtitle, ctaText, ctaHref, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{subtitle}</p>}
      {ctaText && (
        <div className="mt-6">
          {ctaHref ? (
            <Link
              href={ctaHref}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all shadow-lg"
            >
              {ctaText}
            </Link>
          ) : (
            <button
              onClick={onCta}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all shadow-lg"
            >
              {ctaText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
