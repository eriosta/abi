function buildOrderMessage(cart, categories, { bold = true } = {}) {
  const lines = [];
  for (const cat of categories) {
    const catItems = cat.items
      .map((item) => ({ ...item, qty: cart[item.id] || 0 }))
      .filter((item) => item.qty > 0);
    if (catItems.length === 0) continue;
    lines.push(bold ? `*${cat.name}*` : cat.name.toUpperCase());
    for (const item of catItems) {
      lines.push(`• ${item.qty}× ${item.name} (${item.portion})`);
    }
    lines.push('');
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const ask = bold
    ? '¿Me puedes confirmar el *precio total*, la *disponibilidad* y cuándo lo puedo recoger o recibir? ¡Mil gracias!'
    : '¿Me puedes confirmar el precio total, la disponibilidad y cuándo lo puedo recoger o recibir? ¡Mil gracias!';

  return `¡Hola Abi Norma!

Me gustaría hacer el siguiente pedido:

${lines.join('\n').trim()}

Total: ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}.

${ask}`;
}

export function buildWhatsAppUrl(phone, cart, categories) {
  const msg = buildOrderMessage(cart, categories, { bold: true });
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

export function buildSmsUrl(phone, cart, categories) {
  const msg = buildOrderMessage(cart, categories, { bold: false });
  // `sms:+NUMBER?body=...` works on both iOS and Android.
  return `sms:+${phone}?body=${encodeURIComponent(msg)}`;
}

export function totalItemsInCart(cart) {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}
