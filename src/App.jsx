import { useReducer, useMemo, useState, useCallback } from 'react';
import menu from './data/menu.json';
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import CategorySection from './components/CategorySection.jsx';
import OrderBar from './components/OrderBar.jsx';
import Footer from './components/Footer.jsx';
import ItemDetailSheet from './components/ItemDetailSheet.jsx';
import FeaturedCarousel from './components/FeaturedCarousel.jsx';
import {
  buildWhatsAppUrl,
  buildSmsUrl,
  totalItemsInCart,
  totalAmountInCart,
} from './lib/whatsapp.js';
import { I18nProvider, useT } from './lib/i18n.jsx';

function cartReducer(state, action) {
  switch (action.type) {
    case 'increment': {
      const next = (state[action.id] || 0) + 1;
      return { ...state, [action.id]: next };
    }
    case 'decrement': {
      const current = state[action.id] || 0;
      if (current <= 1) {
        const { [action.id]: _, ...rest } = state;
        return rest;
      }
      return { ...state, [action.id]: current - 1 };
    }
    default:
      return state;
  }
}

const PHONE_PLACEHOLDER = '<<<REPLACE_WITH_ABI_NORMA_PHONE_E164>>>';

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}

function AppInner() {
  const t = useT();
  const [cart, dispatch] = useReducer(cartReducer, {});
  const [notes, setNotes] = useState({});
  const [detailItemId, setDetailItemId] = useState(null);

  const { business, categories } = menu;
  const totalItems = useMemo(() => totalItemsInCart(cart), [cart]);
  const totalAmount = useMemo(() => totalAmountInCart(cart, categories), [cart, categories]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of categories) {
      counts[cat.id] = cat.items.reduce((sum, item) => sum + (cart[item.id] || 0), 0);
    }
    return counts;
  }, [cart, categories]);

  const itemsById = useMemo(() => {
    const map = {};
    for (const cat of categories) {
      for (const item of cat.items) {
        map[item.id] = { ...item, categoryEmoji: cat.emoji };
      }
    }
    return map;
  }, [categories]);

  const featuredItems = useMemo(
    () => (menu.featured || []).map((id) => itemsById[id]).filter(Boolean),
    [itemsById]
  );

  const phoneIsConfigured = () => {
    if (business.whatsapp === PHONE_PLACEHOLDER) {
      alert(t('app.phoneAlert'));
      return false;
    }
    return true;
  };

  const handleOrderWhatsApp = () => {
    if (totalItems === 0 || !phoneIsConfigured()) return;
    const url = buildWhatsAppUrl(business.whatsapp, cart, notes, categories);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOrderSms = () => {
    if (totalItems === 0 || !phoneIsConfigured()) return;
    const url = buildSmsUrl(business.whatsapp, cart, notes, categories);
    window.location.href = url;
  };

  const handleUpdateNote = useCallback((id, text) => {
    setNotes((prev) => {
      const next = { ...prev };
      if (text && text.trim()) next[id] = text;
      else delete next[id];
      return next;
    });
  }, []);

  const detailItem = detailItemId ? itemsById[detailItemId] : null;

  return (
    <div className="min-h-screen">
      <Header business={business} />
      <main id="menu">
        <FeaturedCarousel
          items={featuredItems}
          cart={cart}
          onIncrement={(id) => dispatch({ type: 'increment', id })}
          onOpenDetail={(id) => setDetailItemId(id)}
        />
        <CategoryNav categories={categories} categoryCounts={categoryCounts} />

        <div className="mx-auto max-w-3xl px-4 pb-56 pt-6 sm:pt-8 lg:max-w-5xl">
          <div className="flex flex-col gap-10 sm:gap-12">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                cart={cart}
                notes={notes}
                onIncrement={(id) => dispatch({ type: 'increment', id })}
                onDecrement={(id) => dispatch({ type: 'decrement', id })}
                onOpenDetail={(id) => setDetailItemId(id)}
              />
            ))}
          </div>
        </div>

        <About business={business} />
      </main>
      <Footer business={business} />

      <OrderBar
        totalItems={totalItems}
        totalAmount={totalAmount}
        onOrderWhatsApp={handleOrderWhatsApp}
        onOrderSms={handleOrderSms}
      />

      {detailItem && (
        <ItemDetailSheet
          item={detailItem}
          qty={cart[detailItem.id] || 0}
          note={notes[detailItem.id] || ''}
          categoryEmoji={detailItem.categoryEmoji}
          onIncrement={() => dispatch({ type: 'increment', id: detailItem.id })}
          onDecrement={() => dispatch({ type: 'decrement', id: detailItem.id })}
          onUpdateNote={(text) => handleUpdateNote(detailItem.id, text)}
          onClose={() => setDetailItemId(null)}
        />
      )}
    </div>
  );
}
