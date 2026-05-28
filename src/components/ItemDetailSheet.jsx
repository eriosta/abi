import { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../lib/whatsapp.js';
import { useI18n, useT, localized } from '../lib/i18n.jsx';

export default function ItemDetailSheet({
  item,
  qty,
  note,
  categoryEmoji,
  onIncrement,
  onDecrement,
  onUpdateNote,
  onClose,
}) {
  const [mounted, setMounted] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const sheetRef = useRef(null);
  const closeBtnRef = useRef(null);
  const { lang } = useI18n();
  const t = useT();
  const portion = localized(item, 'portion', lang);
  const displayName = localized(item, 'name', lang);
  const altName = lang === 'es' ? item.nameEn : item.name;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const lineTotal = qty * (item.price || 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
        mounted ? 'bg-abi-deep/40 opacity-100' : 'bg-abi-deep/0 opacity-0'
      }`}
    >
      <div
        ref={sheetRef}
        className={`relative w-full max-w-3xl overflow-hidden rounded-t-3xl bg-abi-cream shadow-bar transition-transform duration-300 ${
          mounted ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-abi-deep/15" aria-hidden="true" />
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={t('sheet.close')}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-ink shadow-card ring-1 ring-abi-mist transition active:scale-95 hover:bg-abi-mist"
        >
          <X className="h-5 w-5" strokeWidth={2.5} />
        </button>

        <div className="max-h-[85vh] overflow-y-auto px-5 pb-5 pt-2 sm:px-7">
          <div className="mt-4 aspect-[5/4] w-full overflow-hidden rounded-2xl bg-abi-mist ring-1 ring-abi-mist">
            {imgFailed ? (
              <div
                className="flex h-full w-full items-center justify-center text-7xl"
                aria-hidden="true"
              >
                {categoryEmoji}
              </div>
            ) : (
              <img
                src={item.image}
                alt={displayName}
                onError={() => setImgFailed(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="mt-5">
            <h2
              id="sheet-title"
              className="font-serif text-2xl font-semibold leading-tight text-abi-ink sm:text-3xl"
            >
              {displayName}
            </h2>
            <p className="mt-1 text-sm italic text-slate-600">{altName}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="font-serif text-2xl font-bold tabular-nums text-abi-ink">
                {formatPrice(item.price)}
              </span>
              <span className="inline-flex items-center rounded-full bg-abi-mist px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-abi-ink">
                {portion}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="item-note"
              className="block text-xs font-bold uppercase tracking-wider text-abi-ink/55"
            >
              {t('sheet.notesLabel')}
              <span className="ml-1 font-semibold tracking-normal text-abi-ink/50 normal-case">
                ({t('sheet.notesOptional')})
              </span>
            </label>
            <textarea
              id="item-note"
              value={note}
              onChange={(e) => onUpdateNote(e.target.value)}
              placeholder={t('sheet.notesPlaceholder')}
              rows={2}
              maxLength={200}
              className="mt-2 w-full resize-none rounded-xl border border-abi-mist bg-white px-3 py-2 text-base text-abi-ink placeholder:text-abi-ink/40 focus:border-abi-deep focus:outline-none focus:ring-2 focus:ring-abi-deep/30"
            />
            <p className="mt-1 text-right text-[11px] text-abi-ink/50">{note.length}/200</p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-full bg-abi-mist p-1">
              <button
                type="button"
                onClick={onDecrement}
                disabled={qty === 0}
                aria-label={t('sheet.removeOne')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-ink shadow-card transition active:scale-95 hover:bg-abi-sky disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="h-5 w-5" strokeWidth={2.5} />
              </button>
              <span
                aria-live="polite"
                className="min-w-[2rem] text-center font-serif text-xl font-bold tabular-nums text-abi-ink"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label={t('sheet.addOne')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-abi-deep text-white shadow-card transition active:scale-95 hover:bg-abi-ink"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-abi-deep px-5 py-3 text-base font-extrabold text-white shadow-card transition active:scale-95 hover:bg-abi-ink"
            >
              {qty > 0 ? (
                <span>
                  {t('sheet.done')} · <span className="tabular-nums">{formatPrice(lineTotal)}</span>
                </span>
              ) : (
                <span>{t('sheet.close')}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
