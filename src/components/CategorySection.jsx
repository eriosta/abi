import MenuItemCard from './MenuItemCard.jsx';

export default function CategorySection({ category, cart, onIncrement, onDecrement }) {
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
            className="font-serif text-2xl font-semibold leading-tight text-abi-deep sm:text-3xl"
          >
            <span className="mr-2" aria-hidden="true">{category.emoji}</span>
            {category.name}
          </h2>
          {category.subtitle ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-abi-skyDk">
              {category.subtitle}
            </p>
          ) : (
            <p className="mt-0.5 text-xs italic text-abi-deep/50">{category.nameEn}</p>
          )}
        </div>
        <span className="text-xs font-bold text-abi-deep/40">
          {category.items.length} {category.items.length === 1 ? 'plato' : 'platos'}
        </span>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {category.items.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            qty={cart[item.id] || 0}
            categoryEmoji={category.emoji}
            onIncrement={() => onIncrement(item.id)}
            onDecrement={() => onDecrement(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
