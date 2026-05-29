import { useState } from 'react';
import { Minus, Plus, StickyNote } from 'lucide-react';
import { formatPrice } from '../lib/whatsapp.js';
import { useI18n, useT, localized } from '../lib/i18n.jsx';

export default function MenuItemCard({
  item,
  qty,
  note,
  categoryEmoji,
  onIncrement,
  onDecrement,
  onOpenDetail,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const { lang } = useI18n();
  const t = useT();
  const inCart = qty > 0;
  const hasNote = !!(note && note.trim());
  const portion = localized(item, 'portion', lang);
  const displayName = localized(item, 'name', lang);

  const stopAndIncrement = (e) => {
    e.stopPropagation();
    onIncrement();
  };
  const stopAndDecrement = (e) => {
    e.stopPropagation();
    onDecrement();
  };

  return (
    <article
      onClick={onOpenDetail}
      className={`relative flex cursor-pointer items-stretch gap-3 rounded-2xl bg-white p-3 text-left shadow-card ring-1 transition sm:gap-4 sm:p-4 ${
        inCart ? 'ring-abi-navy' : 'ring-abi-mist'
      } hover:-translate-y-0.5 hover:shadow-md`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail();
        }
      }}
      aria-label={t('card.viewDetails', { name: displayName })}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="font-sans text-[17px] font-bold leading-tight tracking-tight text-abi-ink sm:text-lg">
          {displayName}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[17px] font-extrabold tabular-nums text-abi-ink sm:text-lg">
            {formatPrice(item.price)}
          </span>
          <span className="inline-flex items-center rounded-full bg-abi-mist px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-abi-ink">
            {portion}
          </span>
          {hasNote && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-abi-skySoft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-abi-navy"
              title={note}
            >
              <StickyNote className="h-3 w-3" strokeWidth={2.5} />
              {t('card.hasNote')}
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-shrink-0">
        <div className="h-24 w-24 overflow-hidden rounded-xl bg-abi-mist sm:h-28 sm:w-28">
          {imgFailed ? (
            <div
              className="flex h-full w-full items-center justify-center text-3xl"
              aria-hidden="true"
            >
              {categoryEmoji}
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
        </div>

        <div className="absolute -bottom-2 -right-2">
          {qty === 0 ? (
            <button
              type="button"
              onClick={stopAndIncrement}
              aria-label={t('card.add', { name: displayName })}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-ink shadow-card ring-1 ring-abi-mist transition active:scale-95 hover:bg-abi-sky"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-0.5 rounded-full bg-abi-deep p-1 shadow-card"
            >
              <button
                type="button"
                onClick={stopAndDecrement}
                aria-label={t('card.removeOne', { name: displayName })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/10"
              >
                <Minus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span
                aria-live="polite"
                className="min-w-[1.25rem] text-center text-sm font-extrabold tabular-nums text-white"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={stopAndIncrement}
                aria-label={t('card.addOne', { name: displayName })}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/10"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
