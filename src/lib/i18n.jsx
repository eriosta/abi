import { createContext, useContext, useEffect, useState } from 'react';

const STRINGS = {
  es: {
    'header.intro': 'Comida casera venezolana, hecha con amor por {cook}.',

    'about.title': 'Hecho por {cook}',
    'about.body':
      'Recetas de familia, ingredientes frescos y el sazón de toda la vida. Cada plato lo cocina {cook} en su propia cocina, como lo hacía en Venezuela.',
    'about.bodyAlt':
      'Family recipes, fresh ingredients, and a lifetime of flavor. Every dish made by hand by {cook}.',
    'about.imageAlt': 'Ilustración de {cook}, cocinera de {brand}',
    'about.imagePlaceholderAria': 'Ilustración de {cook} (próximamente)',

    'nav.aria': 'Categorías del menú',
    'nav.countAria': '{n} en tu pedido',

    'featured.title': 'Más pedidos',
    'featured.subtitle': 'Los favoritos de Abi',
    'featured.aria': 'Platos más pedidos',

    'howto.title': 'Cómo pedir',
    'howto.step1': 'Elige tus platos',
    'howto.step2': 'Pide por WhatsApp o SMS',
    'howto.step3': 'Recoge o recibe',

    'category.dish.one': 'plato',
    'category.dish.other': 'platos',

    'card.viewDetails': 'Ver detalles de {name}',
    'card.add': 'Agregar {name}',
    'card.removeOne': 'Quitar uno de {name}',
    'card.addOne': 'Agregar uno más de {name}',
    'card.hasNote': 'Con nota',

    'sheet.close': 'Cerrar',
    'sheet.notesLabel': 'Notas para Abi',
    'sheet.notesOptional': 'opcional',
    'sheet.notesPlaceholder': 'Ej: sin sal, sin cebolla, bien cocido…',
    'sheet.done': 'Listo',
    'sheet.removeOne': 'Quitar uno',
    'sheet.addOne': 'Agregar uno',

    'order.trustStrip': 'Cocinado en casa por Abi · Pide con 24h de anticipación',
    'order.emptyHint': 'Toca + para agregar tu primer platillo.',
    'order.subtotal': 'Subtotal',
    'order.nameLabel': 'Tu nombre',
    'order.namePlaceholder': '¿Quién hace el pedido?',
    'order.nameRequired': 'Escribe tu nombre para pedir',
    'order.item.one': 'artículo',
    'order.item.other': 'artículos',
    'order.whatsapp': 'Pedir por WhatsApp',
    'order.sms': 'o enviar por mensaje de texto (SMS)',

    'footer.follow': 'Síguenos',
    'footer.cookedBy': 'Cocina por {cook}',
    'footer.instagramAria': 'Instagram (próximamente)',
    'footer.facebookAria': 'Facebook (próximamente)',
    'footer.whatsappAria': 'Escribir por WhatsApp',

    'app.phoneAlert':
      'Falta configurar el número de Abi Norma en src/data/menu.json (campo "whatsapp").',

    'lang.toggleAria': 'Cambiar idioma',
  },

  en: {
    'header.intro': 'Home-cooked Venezuelan food, made with love by {cook}.',

    'about.title': 'Made by {cook}',
    'about.body':
      "Family recipes, fresh ingredients, and the seasoning of a lifetime. Every dish is cooked by {cook} in her own kitchen, the way she made it back home in Venezuela.",
    'about.bodyAlt':
      'Recetas de familia, ingredientes frescos y el sazón de toda la vida. Todo hecho a mano por {cook}.',
    'about.imageAlt': 'Illustration of {cook}, cook at {brand}',
    'about.imagePlaceholderAria': 'Illustration of {cook} (coming soon)',

    'nav.aria': 'Menu categories',
    'nav.countAria': '{n} in your order',

    'featured.title': 'Most ordered',
    'featured.subtitle': "Abi's favorites",
    'featured.aria': 'Most ordered dishes',

    'howto.title': 'How to order',
    'howto.step1': 'Pick your dishes',
    'howto.step2': 'Order via WhatsApp or SMS',
    'howto.step3': 'Pick up or delivery',

    'category.dish.one': 'dish',
    'category.dish.other': 'dishes',

    'card.viewDetails': 'View details for {name}',
    'card.add': 'Add {name}',
    'card.removeOne': 'Remove one {name}',
    'card.addOne': 'Add one more {name}',
    'card.hasNote': 'Has note',

    'sheet.close': 'Close',
    'sheet.notesLabel': 'Notes for Abi',
    'sheet.notesOptional': 'optional',
    'sheet.notesPlaceholder': 'no salt, no onion, well done…',
    'sheet.done': 'Done',
    'sheet.removeOne': 'Remove one',
    'sheet.addOne': 'Add one',

    'order.trustStrip': 'Home-cooked by Abi · Order at least 24h ahead',
    'order.emptyHint': 'Tap + to add your first dish.',
    'order.subtotal': 'Subtotal',
    'order.nameLabel': 'Your name',
    'order.namePlaceholder': "Who's ordering?",
    'order.nameRequired': 'Enter your name to order',
    'order.item.one': 'item',
    'order.item.other': 'items',
    'order.whatsapp': 'Order via WhatsApp',
    'order.sms': 'or send by text message (SMS)',

    'footer.follow': 'Follow us',
    'footer.cookedBy': 'Cooked by {cook}',
    'footer.instagramAria': 'Instagram (coming soon)',
    'footer.facebookAria': 'Facebook (coming soon)',
    'footer.whatsappAria': 'Message on WhatsApp',

    'app.phoneAlert':
      'Abi Norma\'s phone number isn\'t set yet. Edit the "whatsapp" field in src/data/menu.json to add it.',

    'lang.toggleAria': 'Switch language',
  },
};

function detectInitialLang() {
  if (typeof window === 'undefined') return 'es';
  const stored = window.localStorage?.getItem('cocina-abi-lang');
  if (stored === 'es' || stored === 'en') return stored;
  const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
}

function interpolate(s, vars) {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{${key}}`
  );
}

const I18nContext = createContext({
  lang: 'es',
  setLang: () => {},
  t: (k) => k,
  tn: (n, k) => k,
});

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang);

  useEffect(() => {
    try {
      window.localStorage?.setItem('cocina-abi-lang', lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, vars) => {
    const dict = STRINGS[lang] || STRINGS.es;
    const fallback = STRINGS.es;
    const raw = dict[key] ?? fallback[key] ?? key;
    return interpolate(raw, vars);
  };

  const tn = (n, baseKey, vars) => t(`${baseKey}.${n === 1 ? 'one' : 'other'}`, vars);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tn }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function useT() {
  return useI18n().t;
}

// Pick a localized field from a data record (item.name vs item.nameEn, etc.)
export function localized(record, baseField, lang) {
  if (lang === 'en') {
    const enField = `${baseField}En`;
    if (record && record[enField]) return record[enField];
  }
  return record?.[baseField];
}
