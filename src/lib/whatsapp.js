export function formatPrice(n) {
  return Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`;
}

function buildOrderMessage(cart, notes, categories, { bold = true, name = '' } = {}) {
  const lines = [];
  let subtotal = 0;
  let totalItems = 0;
  const customer = (name || '').trim();

  for (const cat of categories) {
    const catItems = cat.items
      .map((item) => ({ ...item, qty: cart[item.id] || 0, note: (notes?.[item.id] || '').trim() }))
      .filter((item) => item.qty > 0);
    if (catItems.length === 0) continue;
    lines.push(bold ? `*${cat.name}*` : cat.name.toUpperCase());
    for (const item of catItems) {
      const lineTotal = item.qty * (item.price || 0);
      subtotal += lineTotal;
      totalItems += item.qty;
      lines.push(`• ${item.qty}× ${item.name} (${item.portion})  ${formatPrice(lineTotal)}`);
      if (item.note) {
        lines.push(bold ? `   _Nota: ${item.note}_` : `   Nota: ${item.note}`);
      }
    }
    lines.push('');
  }

  const countLabel = `${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`;
  const summary = bold
    ? `*Subtotal: ${formatPrice(subtotal)} · ${countLabel}*`
    : `Subtotal: ${formatPrice(subtotal)} · ${countLabel}`;

  const ask = bold
    ? '¿Me confirmas si está disponible y cuándo lo puedo recoger? ¡Gracias, Abi!'
    : '¿Me confirmas si está disponible y cuándo lo puedo recoger? ¡Gracias, Abi!';

  const intro = customer ? `Soy ${customer}. Quisiera pedir esto:` : 'Quisiera pedir esto:';
  const signature = customer ? `\n\n— ${customer}` : '';

  return `¡Hola Abi Norma!

${intro}

${lines.join('\n').trim()}

${summary}

${ask}${signature}`;
}

export function buildWhatsAppUrl(phone, cart, notes, categories, name = '') {
  const msg = buildOrderMessage(cart, notes, categories, { bold: true, name });
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export function buildSmsUrl(phone, cart, notes, categories, name = '') {
  const msg = buildOrderMessage(cart, notes, categories, { bold: false, name });
  return `sms:+${phone}?body=${encodeURIComponent(msg)}`;
}

export function totalItemsInCart(cart) {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

export function totalAmountInCart(cart, categories) {
  let sum = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      sum += (cart[item.id] || 0) * (item.price || 0);
    }
  }
  return sum;
}
