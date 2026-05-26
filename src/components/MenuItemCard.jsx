import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

export default function MenuItemCard({ item, qty, categoryEmoji, onIncrement, onDecrement }) {
  const [imgFailed, setImgFailed] = useState(false);
  const inCart = qty > 0;

  return (
    <article
      className={`relative flex items-stretch gap-3 rounded-2xl bg-white p-3 shadow-card ring-1 transition sm:gap-4 sm:p-4 ${
        inCart ? 'ring-abi-skyDk' : 'ring-abi-mist'
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <h3 className="font-serif text-base font-semibold leading-tight text-abi-deep sm:text-lg">
          {item.name}
        </h3>
        <p className="mt-0.5 truncate text-xs italic text-abi-deep/60 sm:text-sm">
          {item.nameEn}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-abi-mist px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-abi-deep">
            {item.portion}
          </span>
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
              alt={item.name}
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
              onClick={onIncrement}
              aria-label={`Agregar ${item.name}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-abi-deep shadow-card ring-1 ring-abi-mist transition active:scale-95 hover:bg-abi-sky hover:text-abi-deep"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            </button>
          ) : (
            <div className="inline-flex items-center gap-0.5 rounded-full bg-abi-deep p-1 shadow-card">
              <button
                type="button"
                onClick={onDecrement}
                aria-label={`Quitar uno de ${item.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/10"
              >
                <Minus className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <span
                aria-live="polite"
                className="min-w-[1.25rem] text-center text-sm font-extrabold text-white"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label={`Agregar uno más de ${item.name}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white transition active:scale-95 hover:bg-white/10"
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
