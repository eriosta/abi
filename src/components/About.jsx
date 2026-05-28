import { useT } from '../lib/i18n.jsx';

export default function About({ business }) {
  const t = useT();
  const cook = business.cook;

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:py-14" aria-labelledby="about-title">
      <div className="text-center">
        <h2
          id="about-title"
          className="font-serif text-2xl font-semibold text-abi-ink sm:text-3xl"
        >
          {t('about.title', { cook })}
        </h2>
        <p className="mt-3 text-abi-ink/80 sm:text-lg">
          {t('about.body', { cook })}
        </p>
        <p className="mt-3 text-sm italic text-slate-600">
          {t('about.bodyAlt', { cook })}
        </p>
      </div>
    </section>
  );
}
