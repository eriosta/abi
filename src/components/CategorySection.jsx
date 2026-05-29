import MenuItemCard from './MenuItemCard.jsx';
import { useI18n, useT, localized } from '../lib/i18n.jsx';

export default function CategorySection({
  category,
  cart,
  notes,
  onIncrement,
  onDecrement,
  onOpenDetail,
}) {
  const { lang } = useI18n();
  const t = useT();
  const name = localized(category, 'name', lang);
  const subtitle = localized(category, 'subtitle', lang);
  const altName = lang === 'es' ? category.nameEn : category.name;
  const dishCount = category.items.length;

  return (
    <section
      id={`cat-${category.id}`}
      className="scroll-mt-20"
      aria-labelledby={`cat-${category.id}-title`}
    >
      <header className="mb-4 flex items-end justify-between gap-3 px-1 sm:mb-5">
        <div>
          <h2
            id={`cat-${category.id}-title`}
            className="font-serif text-2xl font-semibold leading-tight text-abi-ink sm:text-3xl"
          >
            <span className="mr-2" aria-hidden="true">{category.emoji}</span>
            {name}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-abi-ocean">
              {subtitle}
            </p>
          ) : (
            <p className="mt-0.5 text-xs italic text-abi-ink/50">{altName}</p>
          )}
        </div>
        <span className="text-xs font-bold text-abi-ink/40">
          {dishCount} {t(`category.dish.${dishCount === 1 ? 'one' : 'other'}`)}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {category.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            qty={cart[item.id] || 0}
            note={notes?.[item.id] || ''}
            categoryEmoji={category.emoji}
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id)}
            onOpenDetail={() => onOpenDetail(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
