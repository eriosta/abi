import { useEffect, useRef, useState } from 'react';

const STICKY_OFFSET = 64; // px — height of sticky nav + a little breathing room

export default function CategoryNav({ categories, categoryCounts }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? null);
  const navRef = useRef(null);
  const tabRefs = useRef({});

  // Track which category section is currently in view.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sections = categories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of all sections whose top is above the trigger line, pick the lowest one.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id.replace(/^cat-/, '');
          setActiveId(id);
        }
      },
      {
        // Trigger line is just below the sticky nav; bottom margin lets a section
        // stay "active" until the next one crosses the line.
        rootMargin: `-${STICKY_OFFSET + 8}px 0px -60% 0px`,
        threshold: 0,
      }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [categories]);

  // Keep the active tab visible inside the horizontal scroller.
  useEffect(() => {
    const tab = tabRefs.current[activeId];
    if (tab && tab.scrollIntoView) {
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  const handleClick = (id) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - STICKY_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      aria-label="Categorías del menú"
      className="sticky top-0 z-30 border-b border-abi-mist bg-abi-cream/95 backdrop-blur supports-[backdrop-filter]:bg-abi-cream/80"
    >
      <div className="scrollbar-none mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
        {categories.map((c) => {
          const isActive = c.id === activeId;
          const count = categoryCounts?.[c.id] || 0;
          return (
            <button
              key={c.id}
              ref={(el) => { tabRefs.current[c.id] = el; }}
              type="button"
              onClick={() => handleClick(c.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition ${
                isActive
                  ? 'bg-abi-deep text-white shadow-card'
                  : 'bg-white text-abi-deep ring-1 ring-abi-mist hover:ring-abi-skyDk'
              }`}
            >
              <span aria-hidden="true">{c.emoji}</span>
              <span>{c.name}</span>
              {count > 0 && (
                <span
                  className={`ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold ${
                    isActive ? 'bg-white text-abi-deep' : 'bg-abi-deep text-white'
                  }`}
                  aria-label={`${count} en tu pedido`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
