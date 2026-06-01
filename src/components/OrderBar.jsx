import { MessageCircle, MessageSquareText, Clock3 } from 'lucide-react';
import { formatPrice } from '../lib/whatsapp.js';
import { useT } from '../lib/i18n.jsx';

export default function OrderBar({
  totalItems,
  totalAmount,
  customerName,
  onCustomerNameChange,
  onOrderWhatsApp,
  onOrderSms,
}) {
  const t = useT();
  const isEmpty = totalItems === 0;
  const hasName = customerName.trim().length > 0;
  const itemLabel = t(`order.item.${totalItems === 1 ? 'one' : 'other'}`);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-bar ring-1 ring-abi-mist transition-all duration-300">
          <div className="flex items-center justify-center gap-1.5 bg-abi-mist px-3 py-1.5 text-[11px] font-semibold text-abi-ink/90 sm:text-xs">
            <Clock3 className="h-3.5 w-3.5 flex-shrink-0 text-abi-ink/70" aria-hidden="true" />
            <span>{t('order.trustStrip')}</span>
          </div>

          {isEmpty ? (
            <div className="px-4 py-3 text-center">
              <p className="text-sm font-semibold text-abi-ink/75">
                {t('order.emptyHint')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-abi-ocean">
                    {t('order.subtotal')}
                  </span>
                  <span className="font-serif text-2xl font-bold leading-none tabular-nums text-abi-ink sm:text-3xl">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-abi-ink/60">
                  {totalItems} {itemLabel}
                </span>
              </div>

              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-abi-ocean">
                  {t('order.nameLabel')}
                </span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => onCustomerNameChange(e.target.value)}
                  placeholder={t('order.namePlaceholder')}
                  autoComplete="name"
                  required
                  aria-required="true"
                  className="w-full rounded-xl border border-abi-mist bg-white px-3 py-1.5 text-sm font-semibold text-abi-ink placeholder:font-normal placeholder:text-abi-ink/40 focus:border-abi-ocean focus:outline-none focus:ring-2 focus:ring-abi-ocean/20"
                />
              </label>

              <button
                type="button"
                onClick={onOrderWhatsApp}
                disabled={!hasName}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-abi-whatsapp px-5 py-2.5 text-sm font-extrabold text-abi-whatsappInk shadow-card transition active:scale-[0.99] hover:bg-abi-whatsappDeep disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-abi-whatsapp sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
                <span>{hasName ? t('order.whatsapp') : t('order.nameRequired')}</span>
              </button>

              <button
                type="button"
                onClick={onOrderSms}
                disabled={!hasName}
                className="inline-flex w-full items-center justify-center gap-1.5 text-xs font-bold text-abi-ink/70 underline decoration-abi-mist underline-offset-4 transition hover:text-abi-ink hover:decoration-abi-deep disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline disabled:hover:text-abi-ink/70 sm:text-sm"
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
