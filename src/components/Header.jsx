import logo from '../assets/logo.svg';
import LanguageToggle from './LanguageToggle.jsx';
import { useI18n, localized } from '../lib/i18n.jsx';

export default function Header({ business }) {
  const { lang } = useI18n();
  const tagline = localized(business, 'tagline', lang);

  return (
    <header className="border-b border-abi-mist bg-abi-mist">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 lg:max-w-5xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={logo}
            alt={business.name}
            className="h-12 w-12 flex-shrink-0 sm:h-14 sm:w-14"
          />
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-lg font-bold italic text-abi-deep sm:text-xl">
              {business.name}
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-abi-skyDk sm:text-[11px]">
              {tagline}
            </span>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}
