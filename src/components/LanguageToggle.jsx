import { useI18n } from '../lib/i18n.jsx';

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t('lang.toggleAria')}
      className="inline-flex overflow-hidden rounded-full bg-white p-0.5 text-xs font-extrabold shadow-card ring-1 ring-abi-mist"
    >
      <button
        type="button"
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
        className={`min-w-[2.25rem] rounded-full px-3 py-1.5 transition ${
          lang === 'es' ? 'bg-abi-deep text-white' : 'text-abi-deep hover:bg-abi-mist'
        }`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`min-w-[2.25rem] rounded-full px-3 py-1.5 transition ${
          lang === 'en' ? 'bg-abi-deep text-white' : 'text-abi-deep hover:bg-abi-mist'
        }`}
      >
        EN
      </button>
    </div>
  );
}
