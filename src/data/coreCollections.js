import { ABOUT_TEAM } from './aboutTeam';

export const CONTACT_FAQS = [
    {
      q: 'How fast is the In-Store Pickup after placing an online order?',
      a: 'Standard orders are packaged and ready for collection at Counter 2 within 15 to 30 minutes during operating store hours.'
    },
    {
      q: 'Can I request rush thesis hardbound printing?',
      a: 'Yes, our regular thesis turnaround is 2 to 3 days, but we offer a 24-hour rush service for urgent defense requirements.'
    },
    {
      q: 'How do I avail of the 15% student discount?',
      a: 'Enter promo code STUDENT15 at checkout, and present any valid school ID upon in-store pickup or rider delivery inspection.'
    },
    {
      q: 'What file formats are accepted for digital printing?',
      a: 'We accept high-resolution PDF, Microsoft Word (.docx), PowerPoint (.pptx), and vector image files (.jpg, .png).'
    }
  ];

export const CORE_COLLECTIONS = {
  '/about': [{ id: 'team', label: 'Team members', defaults: ABOUT_TEAM, fields: ['name', 'role', 'initials', 'image'] }],
  '/contact': [{ id: 'faq', label: 'Frequently asked questions', defaults: CONTACT_FAQS, fields: ['q', 'a'] }],
};

export function getCollectionItems(values, definition) {
  const order = values[`collection-${definition.id}`];
  return (Array.isArray(order) ? order : definition.defaults.map((_, index) => String(index)))
    .filter(id => typeof id === 'string' && /^[a-zA-Z0-9-]+$/.test(id))
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .map(id => ({ id, ...(definition.defaults[Number(id)] || {}) }));
}

export function getCoreFields(route, values, staticFields) {
  const definitions = CORE_COLLECTIONS[route] || [];
  return [
    ...staticFields.filter(field => !definitions.some(definition => field.id.startsWith(`${definition.id}-`))),
    ...definitions.flatMap(definition => getCollectionItems(values, definition).flatMap((item, index) =>
      definition.fields.map(field => ({ id: `${definition.id}-${item.id}-${field}`, kind: field === 'image' ? 'image' : 'text',
        label: `${definition.label} ${index + 1}: ${{ q: 'Question', a: 'Answer', image: 'Photo' }[field] || field}`, defaultValue: item[field] || '' }))
    )),
  ];
}
