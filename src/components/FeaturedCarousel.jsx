import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { formatPrice } from '../lib/whatsapp.js';
import { useI18n, useT, localized } from '../lib/i18n.jsx';

export default function FeaturedCarousel({ items, cart, onIncrement, onOpenDetail }) {
  const t = useT();
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-4 sm:mt-6" aria-label={t('featured.aria')}>
      <div className="mx-auto max-w-3xl lg:max-w-5xl">
        <header className="mb-3 flex items-end justify-between gap-3 px-4">
          <div>
            <h2 className="flex items-center gap-2 font-serif text-xl font-semibold leading-tight text-abi-ink sm:text-2xl">
              <Sparkles className="h-5 w-5 text-abi-gold" aria-hidden="true" strokeWidth={2.5} />
              {t('featured.title')}
            </h2>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-abi-ocean">
              {t('featured.subtitle')}
            </p>
          </div>
        </header>

        <div className="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {items.map((item) => (
            <FeaturedCard
              key={item.id}
              item={item}
              qty={cart[item.id] || 0}
              onIncrement={() => onIncrement(item.id)}
              onOpenDetail={() => onOpenDetail(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ item, qty, onIncrement, onOpenDetail }) {
  const [imgFailed, setImgFailed] = useState(false);
  const { lang } = useI18n();
  const t = useT();
  const inCart = qty > 0;
  const portion = localized(item, 'portion', lang);
  const displayName = localized(item, 'name', lang);

  return (
    <article
      onClick={onOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      aria-label={t('card.viewDetails', { name: displayName })}
      className={`relative flex w-40 flex-shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 transition active:scale-[0.98] hover:-translate-y-0.5 hover:shadow-md sm:w-44 ${
        inCart ? 'ring-abi-navy' : 'ring-abi-mist'
      }`}
    >
      <div className="relative aspect-square w-full bg-abi-mist">
        {imgFailed ? (
          <div
            className="flex h-full w-full items-center justify-center text-4xl"
            aria-hidden="true"
          >
            {item.categoryEmoji || '🍽️'}
          </div>
        ) : (
          <img
            src={item.image}
            alt={displayName}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
        {inCart && (
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-abi-navy px-1.5 text-[11px] font-extrabold tabular-nums text-white shadow-card"
          >
            {qty}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onIncrement();
          }}
          aria-label={t('card.add', { name: displayName })}
          className="absolute bottom-2 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-abi-ink shadow-card ring-1 ring-abi-mist transition active:scale-95 hover:bg-abi-sky"
        >
          <Plus className="h-4 w-4" strokeWidth={3} />
        </button>
      </div>
      <div className="flex flex-col gap-0.5 px-2.5 py-2">
        <h3 className="truncate text-[13px] font-bold leading-tight text-abi-ink">
          {displayName}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-extrabold tabular-nums text-abi-ink">
            {formatPrice(item.price)}
          </span>
          <span className="truncate text-[10px] font-bold uppercase tracking-wide text-abi-ocean">
            {portion}
          </span>
        </div>
      </div>
    </article>
  );
}
