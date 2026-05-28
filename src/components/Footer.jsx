import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useI18n, useT, localized } from '../lib/i18n.jsx';

export default function Footer({ business }) {
  const { lang } = useI18n();
  const t = useT();
  const whatsappHref = `https://wa.me/${business.whatsapp}`;
  const serviceArea = localized(business, 'serviceArea', lang);

  return (
    <footer className="mt-12 border-t border-abi-mist bg-abi-cream pb-56 pt-10 sm:pb-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
        <img src={logo} alt="" aria-hidden="true" className="h-20 w-20" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-abi-ink/55">
          {t('footer.follow')}
        </p>
        <div className="flex items-center gap-3">
          {/* TODO: replace with real Instagram link when ready */}
          <a
            href="#"
            aria-label={t('footer.instagramAria')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-ink shadow-card ring-1 ring-abi-mist transition hover:bg-abi-sky"
          >
            <Instagram className="h-5 w-5" />
          </a>
          {/* TODO: replace with real Facebook link when ready */}
          <a
            href="#"
            aria-label={t('footer.facebookAria')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-ink shadow-card ring-1 ring-abi-mist transition hover:bg-abi-sky"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('footer.whatsappAria')}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-abi-deep text-white shadow-card transition hover:bg-abi-ink"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm text-abi-ink/80">{serviceArea}</p>
        <p className="text-sm italic text-abi-ink/70">{t('footer.cookedBy', { cook: business.cook })}</p>
        <p className="text-xs text-abi-ink/50">© 2026 {business.name}</p>
      </div>
    </footer>
  );
}
