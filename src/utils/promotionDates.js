// Date-only promotion deadlines include the whole selected day in the store timezone.
export function storeDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
}

export function isPromotionExpired(promo, now = new Date()) {
  return Boolean(promo.endDate && promo.endDate < storeDate(now));
}
