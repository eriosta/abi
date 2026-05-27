import { MessageCircle, MessageSquareText, Clock3 } from 'lucide-react';
import { formatPrice } from '../lib/whatsapp.js';
import { useT } from '../lib/i18n.jsx';

export default function OrderBar({ totalItems, totalAmount, onOrderWhatsApp, onOrderSms }) {
  const t = useT();
  const isEmpty = totalItems === 0;
  const itemLabel = t(`order.item.${totalItems === 1 ? 'one' : 'other'}`);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-bar ring-1 ring-abi-mist transition-all duration-300">
          <div className="flex items-center justify-center gap-1.5 bg-abi-mist px-3 py-1.5 text-[11px] font-semibold text-abi-deep/90 sm:text-xs">
            <Clock3 className="h-3.5 w-3.5 flex-shrink-0 text-abi-deep/70" aria-hidden="true" />
            <span>{t('order.trustStrip')}</span>
          </div>

          {isEmpty ? (
            <div className="px-4 py-3 text-center">
              <p className="text-sm font-semibold text-abi-deep/75">
                {t('order.emptyHint')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3 sm:gap-3 sm:p-4">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-abi-skyDk">
                    {t('order.subtotal')}
                  </span>
                  <span className="font-serif text-2xl font-bold leading-none tabular-nums text-abi-deep sm:text-3xl">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-abi-deep/60">
                  {totalItems} {itemLabel}
                </span>
              </div>

              <button
                type="button"
                onClick={onOrderWhatsApp}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-abi-terracotta px-5 py-3.5 text-base font-extrabold text-white shadow-card transition active:scale-[0.99] hover:bg-abi-terracottaDk"
              >
                <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
                <span>{t('order.whatsapp')}</span>
              </button>

              <button
                type="button"
                onClick={onOrderSms}
                className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-bold text-abi-deep/70 underline decoration-abi-mist underline-offset-4 transition hover:text-abi-deep hover:decoration-abi-skyDk sm:text-sm"
              >
                <MessageSquareText className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>{t('order.sms')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
