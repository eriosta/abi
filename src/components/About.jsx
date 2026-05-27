import { useState } from 'react';
import { useT } from '../lib/i18n.jsx';

export default function About({ business }) {
  const [imgFailed, setImgFailed] = useState(false);
  const t = useT();
  const cook = business.cook;

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:py-14" aria-labelledby="about-title">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        {imgFailed ? (
          <div
            className="flex h-44 w-44 flex-shrink-0 items-center justify-center rounded-3xl bg-abi-sand text-5xl shadow-card ring-4 ring-abi-mist sm:h-56 sm:w-56"
            aria-label={t('about.imagePlaceholderAria', { cook })}
          >
            🇻🇪
          </div>
        ) : (
          <img
            src="/images/abi-norma.png"
            alt={t('about.imageAlt', { cook, brand: business.name })}
            onError={() => setImgFailed(true)}
            className="h-44 w-44 flex-shrink-0 rounded-3xl bg-abi-cream object-contain shadow-card ring-4 ring-abi-mist sm:h-56 sm:w-56"
          />
        )}
        <div className="text-center sm:text-left">
          <h2
            id="about-title"
            className="font-serif text-2xl font-semibold text-abi-deep sm:text-3xl"
          >
            {t('about.title', { cook })}
          </h2>
          <p className="mt-3 text-abi-deep/80 sm:text-lg">
            {t('about.body', { cook })}
          </p>
          <p className="mt-3 text-sm italic text-slate-600">
            {t('about.bodyAlt', { cook })}
          </p>
        </div>
      </div>
    </section>
  );
}
