import { UtensilsCrossed, MessageCircle, ShoppingBag } from 'lucide-react';
import { useT } from '../lib/i18n.jsx';

const STEPS = [
  { icon: UtensilsCrossed, key: 'howto.step1' },
  { icon: MessageCircle, key: 'howto.step2' },
  { icon: ShoppingBag, key: 'howto.step3' },
];

export default function HowToOrder() {
  const t = useT();

  return (
    <section className="mt-10 bg-abi-skySoft sm:mt-14" aria-labelledby="howto-title">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10 lg:max-w-5xl">
        <h2
          id="howto-title"
          className="text-center text-xs font-bold uppercase tracking-[0.2em] text-abi-navy"
        >
          {t('howto.title')}
        </h2>
        <ol className="mt-5 grid grid-cols-3 gap-3 sm:gap-6">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.key} className="flex flex-col items-center text-center">
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-abi-navy shadow-card ring-1 ring-abi-mist sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
                  </span>
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-abi-gold text-[11px] font-extrabold text-white">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold leading-tight text-abi-navy sm:text-sm">
                  {t(step.key)}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
