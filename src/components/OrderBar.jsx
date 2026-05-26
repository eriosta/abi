import { MessageCircle, MessageSquareText, Info } from 'lucide-react';

export default function OrderBar({ totalItems, onOrderWhatsApp, onOrderSms, visible }) {
  const disabled = totalItems === 0;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!visible}
    >
      <div className="mx-auto max-w-3xl px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="overflow-hidden rounded-2xl bg-white shadow-bar ring-1 ring-abi-mist">
          <div className="flex items-center gap-1.5 bg-abi-mist/70 px-3 py-1.5 text-[11px] font-semibold text-abi-deep/80 sm:text-xs">
            <Info className="h-3.5 w-3.5 flex-shrink-0 text-abi-skyDk" aria-hidden="true" />
            <span>Te confirmamos precios y disponibilidad por WhatsApp o SMS.</span>
          </div>

          <div className="flex items-center gap-3 p-3">
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-xs font-semibold uppercase tracking-wider text-abi-skyDk">
                Tu pedido
              </span>
              <span className="text-sm font-bold text-abi-deep">
                {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
              </span>
            </div>

            <div className="flex flex-shrink-0 flex-col items-stretch gap-2">
              <button
                type="button"
                onClick={onOrderWhatsApp}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-abi-deep px-4 py-2.5 text-sm font-extrabold text-white shadow-card transition active:scale-95 hover:bg-abi-skyDk disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                <span>Pedir por WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={onOrderSms}
                disabled={disabled}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-abi-skyDk px-4 py-2.5 text-sm font-extrabold text-white shadow-card transition active:scale-95 hover:bg-abi-deep disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
              >
                <MessageSquareText className="h-4 w-4" strokeWidth={2.5} />
                <span>Pedir por SMS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
