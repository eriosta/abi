import { useReducer, useMemo } from 'react';
import menu from './data/menu.json';
import Header from './components/Header.jsx';
import About from './components/About.jsx';
import CategoryNav from './components/CategoryNav.jsx';
import CategorySection from './components/CategorySection.jsx';
import OrderBar from './components/OrderBar.jsx';
import Footer from './components/Footer.jsx';
import { buildWhatsAppUrl, buildSmsUrl, totalItemsInCart } from './lib/whatsapp.js';

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
  const [cart, dispatch] = useReducer(cartReducer, {});
  const totalItems = useMemo(() => totalItemsInCart(cart), [cart]);
  const { business, categories } = menu;

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of categories) {
      counts[cat.id] = cat.items.reduce((sum, item) => sum + (cart[item.id] || 0), 0);
    }
    return counts;
  }, [cart, categories]);

  const phoneIsConfigured = () => {
    if (business.whatsapp === PHONE_PLACEHOLDER) {
      alert(
        'Falta configurar el número de Abi Norma en src/data/menu.json (campo "whatsapp").'
      );
      return false;
    }
    return true;
  };

  const handleOrderWhatsApp = () => {
    if (totalItems === 0 || !phoneIsConfigured()) return;
    const url = buildWhatsAppUrl(business.whatsapp, cart, categories);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOrderSms = () => {
    if (totalItems === 0 || !phoneIsConfigured()) return;
    const url = buildSmsUrl(business.whatsapp, cart, categories);
    // sms: scheme on iOS doesn't always like target="_blank", so navigate same-tab.
    window.location.href = url;
  };

  return (
    <div className="min-h-screen">
      <Header business={business} />
      <main id="menu">
        <CategoryNav categories={categories} categoryCounts={categoryCounts} />

        <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:pt-8 lg:max-w-5xl">
          <div className="flex flex-col gap-10 sm:gap-12">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                cart={cart}
                onIncrement={(id) => dispatch({ type: 'increment', id })}
                onDecrement={(id) => dispatch({ type: 'decrement', id })}
              />
            ))}
          </div>
        </div>

        <About business={business} />
      </main>
      <Footer business={business} />
      <OrderBar
        totalItems={totalItems}
        onOrderWhatsApp={handleOrderWhatsApp}
        onOrderSms={handleOrderSms}
        visible={totalItems > 0}
      />
    </div>
  );
}
