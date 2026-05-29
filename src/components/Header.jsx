import logoIcon from '../assets/logo-icon.svg';
import LanguageToggle from './LanguageToggle.jsx';
import { useI18n, localized } from '../lib/i18n.jsx';

export default function Header({ business }) {
  const { lang } = useI18n();
  const tagline = localized(business, 'tagline', lang);

  return (
    <header className="border-b border-abi-navy/10 bg-abi-sky">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 lg:max-w-5xl">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Simplified icon mark in the top bar; full badge is used in the footer + share card. */}
          <img
            src={logoIcon}
            alt={business.name}
            className="h-12 w-12 flex-shrink-0 rounded-full ring-2 ring-white/70 sm:h-14 sm:w-14"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-xl font-semibold text-abi-navy sm:text-2xl">
              {business.name}
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-abi-navy/75 sm:text-[11px]">
              {tagline}
            </span>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
