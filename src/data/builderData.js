// Default data for Mama Mo Website Builder, Dynamic Pages, Navigation, Media Library & Inventory Ledger

export const INITIAL_NAV_CONFIG = {
  headerNav: [
    { id: 'nav-home', label: 'Home', path: 'home', isCustom: false, visible: true, order: 1 },
    { id: 'nav-shop', label: 'Shop', path: 'shop', isCustom: false, visible: true, order: 2 },
    { id: 'nav-promotions', label: 'Promotions', path: 'promotions', isCustom: false, visible: true, order: 3 },
    { id: 'nav-services', label: 'Printing Services', path: 'services', isCustom: false, visible: true, order: 4 },
    { id: 'nav-transactions', label: 'Transactions', path: 'transactions', isCustom: false, visible: true, order: 5 },
    { id: 'nav-about', label: 'About Us', path: 'about', isCustom: false, visible: true, order: 6 },
    { id: 'nav-contact', label: 'Contact', path: 'contact', isCustom: false, visible: true, order: 7 }
  ],
  footerNav: [
    { id: 'fnav-shop', label: 'All Products', path: 'shop', isCustom: false, visible: true, order: 1 },
    { id: 'fnav-promos', label: 'Active Promotions', path: 'promotions', isCustom: false, visible: true, order: 2 },
    { id: 'fnav-services', label: 'Thesis & Printing', path: 'services', isCustom: false, visible: true, order: 3 },
    { id: 'fnav-transactions', label: 'Transactions', path: 'transactions', isCustom: false, visible: true, order: 4 },
    { id: 'fnav-tracking', label: 'Order Tracking', path: 'tracking', isCustom: false, visible: true, order: 5 },
    { id: 'fnav-about', label: 'Our Story', path: 'about', isCustom: false, visible: true, order: 6 },
    { id: 'fnav-contact', label: 'Banago Store Location', path: 'contact', isCustom: false, visible: true, order: 7 }
  ]
};

export const INITIAL_CUSTOM_PAGES = [
  {
    id: 'page-back-to-school',
    title: 'Back to School 2026 Academic Essentials',
    slug: 'back-to-school',
    description: 'Curated stationery packages, research binding specials, and classroom bundles for Plaridel Elementary, PINHS, and Nagcarlan schools.',
    status: 'published', // 'published' | 'draft' | 'archived'
    author: 'Anne Francine Celerio (Store Manager)',
    createdAt: '2026-02-01',
    updatedAt: '2026-02-15',
    publishedAt: '2026-02-15',
    showInNav: true,
    showInFooter: true,
    components: [
      {
        id: 'comp-bts-hero',
        type: 'hero',
        data: {
          eyebrow: 'Semester Opening Special',
          title: 'Back to School 2026 Academic Essentials',
          subtitle: 'Equip yourself with gel pens, bond paper reams, and rush document printing at student-friendly rates.',
          buttonText: 'Shop School Supplies',
          buttonLink: 'shop',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80',
          align: 'center',
          theme: 'dark'
        }
      },
      {
        id: 'comp-bts-banner',
        type: 'announcement',
        data: {
          text: 'STUDENT FLASH DISCOUNT: Present any school ID or use code STUDENT15 for 15% off at checkout.',
          badge: 'Promo Code'
        }
      },
      {
        id: 'comp-bts-text',
        type: 'text_image',
        data: {
          eyebrow: 'Banago, Nagcarlan Hub',
          title: 'Engineered for Students & Educators',
          description: 'Located in Purok 5, Barangay Banago, Nagcarlan, Laguna along Nagcarlan–Rizal Road, Mama Mo provides rapid same-day pickup for urgent project materials, graphing pads, and clean spiral-bound lecture notes.',
          buttonText: 'View Store Location',
          buttonLink: 'contact',
          imageUrl: '/images/paper_one_ream.jpg',
          imagePosition: 'right'
        }
      },
      {
        id: 'comp-bts-products',
        type: 'product_grid',
        data: {
          title: 'Essential Student Picks',
          subtitle: 'Tested and proven materials favored by college majors.',
          category: 'School Supplies',
          limit: 4
        }
      },
      {
        id: 'comp-bts-faq',
        type: 'faq',
        data: {
          title: 'Student Assistance & Pickup FAQ',
          items: [
            { q: 'Can my classmate pick up my prepaid order?', a: 'Yes! Simply share the 6-character Order Tracking Code with your classmate to present at Counter 2.' },
            { q: 'Is there a minimum order for in-store pickup?', a: 'No minimum order amount required. All supplies are packed and ready within 2 hours.' },
            { q: 'How do I avail the student discount?', a: 'Enter STUDENT15 during online checkout to apply your 15% academic discount instantly.' }
          ]
        }
      }
    ]
  },
  {
    id: 'page-custom-announcements',
    title: 'Store Operations & Midterm Rush Hours',
    slug: 'custom-announcements',
    description: 'Updated operating hours, extended thesis production shifts, and weekend pickup arrangements.',
    status: 'published',
    author: 'Francine Delos Reyes (Store Manager)',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-10',
    publishedAt: '2026-03-10',
    showInNav: false,
    showInFooter: true,
    components: [
      {
        id: 'comp-ann-hero',
        type: 'hero',
        data: {
          eyebrow: 'Customer Notice',
          title: 'Extended Operating Hours for Midterm Season',
          subtitle: 'We are expanding our production shifts to support high-volume departmental exam printing and thesis defense manuscripts.',
          buttonText: 'Explore Printing Services',
          buttonLink: 'services',
          imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1600&q=80',
          align: 'left',
          theme: 'light'
        }
      },
      {
        id: 'comp-ann-rich',
        type: 'rich_text',
        data: {
          title: 'Midterm Production Schedule Guidelines',
          content: 'Starting this week, our printing facility at Purok 5, Barangay Banago, Nagcarlan, Laguna 4002 will accept rush color and project binding requests until 6:30 PM Monday through Friday. Customers ordering via the website can select same-day pickup slots directly during checkout.'
        }
      },
      {
        id: 'comp-ann-cta',
        type: 'cta',
        data: {
          title: 'Need a Custom Print Quote or Urgent Inquiry?',
          subtitle: 'Submit your manuscript page count, binding specifications, and timeline for an instant quotation.',
          buttonText: 'Submit Print Request',
          buttonLink: 'services'
        }
      }
    ]
  }
];

export const INITIAL_MEDIA_LIBRARY = [
  {
    id: 'med-1',
    name: 'Paper One All Purpose Ream',
    url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    category: 'Products',
    size: '240 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-01-10'
  },
  {
    id: 'med-2',
    name: 'Pilot G-Tec Black Pen Tray',
    url: '/images/pilot_gtec_pens.jpg',
    category: 'Products',
    size: '310 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-01-12'
  },
  {
    id: 'med-3',
    name: 'University Study & Stationery Workspace',
    url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    category: 'Banners',
    size: '520 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-01-15'
  },
  {
    id: 'med-4',
    name: 'High Volume Digital Printing Facility',
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80',
    category: 'Services',
    size: '480 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-01-20'
  },
  {
    id: 'med-5',
    name: 'Hardbound Gold Embossed Thesis',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    category: 'Services',
    size: '350 KB',
    type: 'image/jpeg',
    uploadedAt: '2026-02-01'
  }
];

export const INITIAL_INVENTORY_LEDGER = [
  {
    id: 'led-1',
    productId: 'mm-prod-1',
    productName: 'Paper One All Purpose Copier Paper (A4, 80gsm)',
    changeAmount: +100,
    previousStock: 45,
    newStock: 145,
    reason: 'Initial Restock from Distributor Delivery',
    date: '2026-02-01 09:30 AM',
    user: 'Store Admin (Francine)'
  },
  {
    id: 'led-2',
    productId: 'mm-prod-1',
    productName: 'Paper One All Purpose Copier Paper (A4, 80gsm)',
    changeAmount: -2,
    previousStock: 145,
    newStock: 143,
    reason: 'Customer Order #MM-2026-001 (In-store pickup)',
    date: '2026-02-05 02:15 PM',
    user: 'System (Online Checkout)'
  },
  {
    id: 'led-3',
    productId: 'mm-prod-3',
    productName: 'Epson 003 Genuine Dye Ink Bottle (Black)',
    changeAmount: +30,
    previousStock: 18,
    newStock: 48,
    reason: 'Received shipment from authorized Epson reseller',
    date: '2026-02-10 11:00 AM',
    user: 'Store Admin (Francine)'
  },
  {
    id: 'led-4',
    productId: 'mm-prod-5',
    productName: 'Deli Heavy Duty Desktop Stapler',
    changeAmount: -1,
    previousStock: 25,
    newStock: 24,
    reason: 'Customer Order #MM-2026-002 (Local Delivery)',
    date: '2026-02-12 04:45 PM',
    user: 'System (Online Checkout)'
  }
];

export const INITIAL_PROMOTIONS_LIST = [
  {
    id: 'promo-1',
    code: 'STUDENT15',
    title: 'Academic Community 15% Savings',
    description: '15% discount for university students, educators, and institutional staff.',
    discountType: 'percentage', // 'percentage' | 'fixed'
    discountValue: 15,
    minSpend: 0,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    active: true,
    usageCount: 42
  },
  {
    id: 'promo-2',
    code: 'BULK50',
    title: 'Ream & Office Bulk Order Discount',
    description: 'Flat ₱50 reduction on cart total for orders of ₱800 or more.',
    discountType: 'fixed',
    discountValue: 50,
    minSpend: 800,
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    active: true,
    usageCount: 18
  },
  {
    id: 'promo-3',
    code: 'FACULTY20',
    title: 'Departmental Faculty Course Packet Promo',
    description: '20% off classroom supplies and examination master printouts.',
    discountType: 'percentage',
    discountValue: 20,
    minSpend: 1500,
    startDate: '2026-01-15',
    endDate: '2026-05-30',
    active: true,
    usageCount: 9
  }
];

const systemSection = (id, type, data, placement) => ({
  id: `system-${id}`,
  type,
  data: { ...data, ...(placement ? { placement } : {}) }
});

const LEGACY_CORE_PAGES = [
  {
    id: 'system-page-home',
    systemRoute: '/',
    slug: 'home',
    title: 'Home',
    description: 'The storefront home page.',
    hybrid: false,
    components: [
      systemSection('home-hero', 'hero', {
        eyebrow: 'Mama Mo Ink Print and Supplies',
        title: 'Everything You Need, All in One Place.',
        subtitle: 'Affordable school supplies and dependable printing services in Banago, Nagcarlan.',
        buttonText: 'Explore Catalog',
        buttonLink: 'shop',
        imageUrl: '/images/mama_mo_logo.jpg',
        align: 'center',
        theme: 'dark'
      }),
      systemSection('home-categories', 'category_grid', { title: 'Shop By Category', columns: 4, items: [
        { category: 'School Supplies', title: 'School Supplies', imageUrl: '/images/mongol_pencils.jpg', buttonText: 'Shop Supplies' },
        { category: 'Printing Materials', title: 'Printing Materials', imageUrl: '/images/epson_003_ink.jpg', buttonText: 'Browse Materials' },
        { category: 'Paper Products', title: 'Paper Products', imageUrl: '/images/paper_one_ream.jpg', buttonText: 'View Paper' },
        { category: 'Office Supplies', title: 'Office Supplies', imageUrl: '/images/deli_stapler.jpg', buttonText: 'Shop Office' }
      ] }),
      systemSection('home-products', 'product_grid', { title: 'Featured Products', subtitle: 'Customer favorites for school, work, and everyday needs.', category: 'All', limit: 4 }),
      systemSection('home-values', 'features_grid', { title: 'Why Choose Mama Mo', columns: 4, items: [
        { icon: 'printer', title: 'Same-Day Printing', description: 'Fast production for urgent school and business requirements.' },
        { icon: 'graduation-cap', title: 'Student Discounts', description: 'Accessible pricing for students, teachers, and campus groups.' },
        { icon: 'timer', title: 'Quick Turnaround', description: 'Priority service when every minute matters.' },
        { icon: 'shield-check', title: 'Quality Guarantee', description: 'Carefully checked output before every order leaves the store.' }
      ] }),
      systemSection('home-cta', 'cta', { title: 'Ready To Print or Shop?', subtitle: 'Visit our store or browse the catalog online.', buttonText: 'Contact Our Store', buttonLink: 'contact' })
    ]
  },
  {
    id: 'system-page-shop',
    systemRoute: '/shop',
    slug: 'shop',
    title: 'Shop',
    description: 'Product catalog page sections.',
    hybrid: true,
    components: [
      systemSection('shop-banner', 'announcement', { badge: 'Store Notice', text: 'Browse school, office, and printing essentials available for pickup and delivery.' }, 'top'),
      systemSection('shop-categories', 'category_grid', { title: 'Browse Categories', columns: 4, items: [
        { category: 'School Supplies', title: 'School Supplies', imageUrl: '/images/mongol_pencils.jpg', buttonText: 'Shop Supplies' },
        { category: 'Printing Materials', title: 'Printing Materials', imageUrl: '/images/epson_003_ink.jpg', buttonText: 'Browse Materials' }
      ] }, 'top'),
      systemSection('shop-faq', 'faq', { title: 'Shopping & Pickup FAQ', items: [
        { q: 'How do I collect my order?', a: 'Choose in-store pickup at checkout and present your order reference at the store.' },
        { q: 'Can I filter the catalog?', a: 'Use the category, search, and filter controls in the product catalog above.' }
      ] }, 'bottom')
    ]
  },
  {
    id: 'system-page-promotions',
    systemRoute: '/promotions',
    slug: 'promotions',
    title: 'Promotions',
    description: 'Current promotions and student perks page sections.',
    hybrid: true,
    components: [
      systemSection('promotions-banner', 'announcement', { badge: 'Special Offers', text: 'Discover current savings for students, educators, and local businesses.' }, 'top'),
      systemSection('promotions-faq', 'faq', { title: 'Promotion FAQ', items: [
        { q: 'How do I apply a promotion code?', a: 'Copy the code shown with an offer and apply it in your shopping cart or at checkout.' },
        { q: 'Can offers be combined?', a: 'Promotion eligibility and combinations are shown with each active offer.' }
      ] }, 'bottom')
    ]
  },
  {
    id: 'system-page-services',
    systemRoute: '/services',
    slug: 'services',
    title: 'Printing Services',
    description: 'Printing, copying, and document finishing services.',
    hybrid: true,
    components: [
      systemSection('services-hero', 'hero', { eyebrow: 'Banago Printing Counter', title: 'Printing, Copying & Document Finishing', subtitle: 'Reliable printing and binding for students, educators, and local businesses.', buttonText: 'Contact Our Team', buttonLink: 'contact', imageUrl: '/images/banago_store_location_map.png', align: 'center', theme: 'dark' }, 'top'),
      systemSection('services-pricing', 'pricing_table', { title: 'Services & Pricing', subtitle: 'Starting rates for our most requested services.', items: [
        { service: 'Black & White Printing', spec: 'A4 / Short / Long', price: 'From ₱2/page', notes: 'Same-day' },
        { service: 'Full Color Printing', spec: 'A4, high quality', price: 'From ₱10/page', notes: 'Same-day' },
        { service: 'Soft Binding', spec: 'Up to 200 pages', price: 'From ₱60', notes: '30–60 minutes' },
        { service: 'Hard Binding', spec: 'Thesis with gold stamp', price: 'From ₱450', notes: '2–3 working days' }
      ] }, 'top'),
      systemSection('services-process', 'steps', { title: 'How to Place a Print Order', items: [
        { title: 'Choose Your Service', description: 'Select printing, copying, or finishing options that fit your project.' },
        { title: 'Share Your Specifications', description: 'Provide file details, paper size, quantity, and binding preferences.' },
        { title: 'Confirm Your Estimate', description: 'Review the calculated estimate and submit your request.' },
        { title: 'Pick Up Your Order', description: 'We will contact you when your order is ready for collection.' }
      ] }, 'top'),
      systemSection('services-faq', 'faq', { title: 'Printing Services FAQ', items: [
        { q: 'Can I request rush thesis printing?', a: 'Yes. Share your deadline and specifications so our team can confirm availability.' },
        { q: 'What file types can I submit?', a: 'PDF is recommended for consistent print formatting. Contact the store for other formats.' }
      ] }, 'bottom')
    ]
  },
  {
    id: 'system-page-about',
    systemRoute: '/about',
    slug: 'about',
    title: 'About Us',
    description: 'Learn about Mama Mo Ink Print and Supplies.',
    hybrid: false,
    components: [
      systemSection('about-hero', 'hero', { eyebrow: 'Established 2026 • Nagcarlan, Laguna', title: 'A Local Hub for School & Print Essentials', subtitle: 'Supporting students, educators, and neighbors with affordable supplies and dependable service.', imageUrl: '/images/mama_mo_logo.jpg', align: 'center', theme: 'dark' }),
      systemSection('about-split', 'text_image', { eyebrow: 'Our Story', title: 'Designed for Learners & Educators', description: 'Mama Mo Ink Print and Supplies brings everyday school materials and practical printing services together in Barangay Banago, Nagcarlan.', buttonText: 'Get in Touch', buttonLink: 'contact', imageUrl: '/images/paper_one_ream.jpg', imagePosition: 'right' }),
      systemSection('about-story', 'rich_text', { title: 'Our Purpose', content: 'We help students, teachers, and local businesses get the supplies and print services they need without unnecessary trips. Our team is committed to friendly assistance, fair pricing, and reliable results.' }),
      systemSection('about-location', 'location_map', { storeName: 'Mama Mo Ink Print and Supplies', address: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002', phone: 'Contact our Banago store for current service inquiries', hours: 'Monday–Saturday: 8:00 AM–7:00 PM\\nSunday: 9:00 AM–5:00 PM', mapEmbedUrl: '' })
    ]
  },
  {
    id: 'system-page-contact',
    systemRoute: '/contact',
    slug: 'contact',
    title: 'Contact',
    description: 'Contact information and store location.',
    hybrid: true,
    components: [
      systemSection('contact-hero', 'hero', { eyebrow: 'We Are Here to Help', title: 'Contact Mama Mo', subtitle: 'Get in touch about bulk orders, printing, and store services.', imageUrl: '/images/banago_store_location_map.png', align: 'center', theme: 'dark' }, 'top'),
      systemSection('contact-location', 'location_map', { storeName: 'Mama Mo Ink Print and Supplies', address: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002', phone: 'Contact our Banago store for current service inquiries', hours: 'Monday–Saturday: 8:00 AM–7:00 PM\\nSunday: 9:00 AM–5:00 PM', mapEmbedUrl: '' }, 'top'),
      systemSection('contact-info', 'features_grid', { title: 'Contact & Store Information', columns: 3, items: [
        { icon: 'map-pin', title: 'Visit Us', description: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002.' },
        { icon: 'phone', title: 'Call the Store', description: 'Contact our Banago team for current service inquiries.' },
        { icon: 'clock', title: 'Store Hours', description: 'Monday–Saturday, 8:00 AM–7:00 PM; Sunday, 9:00 AM–5:00 PM.' }
      ] }, 'top'),
      systemSection('contact-faq', 'faq', { title: 'Frequently Asked Questions', items: [
        { q: 'How soon can I pick up an online order?', a: 'Pickup readiness depends on the items ordered and current store workload. Check your order updates.' },
        { q: 'Can I request rush printing?', a: 'Contact our printing team with your specifications and deadline to confirm availability.' }
      ] }, 'bottom')
    ]
  },
  {
    id: 'system-page-transactions',
    systemRoute: '/transactions',
    slug: 'transactions',
    title: 'Transactions',
    description: 'Order history and transaction tracking page sections.',
    hybrid: true,
    components: [
      systemSection('transactions-banner', 'announcement', { badge: 'Order Center', text: 'Review your order history and follow the latest order status below.' }, 'top'),
      systemSection('transactions-faq', 'faq', { title: 'Order History FAQ', items: [
        { q: 'Where can I find my order status?', a: 'Your recent orders and their current statuses are listed in the transaction history above.' },
        { q: 'Need help with an order?', a: 'Contact the store and provide your order reference for assistance.' }
      ] }, 'bottom')
    ]
  }
];

// Core pages share the storefront implementation instead of approximate templates.
export const SYSTEM_CORE_PAGES = LEGACY_CORE_PAGES.map(page => ({
  ...page, hybrid: true, components: [], nativeDesignVersion: 1,
}));

export const normalizeCorePage = (page) => {
  const definition = SYSTEM_CORE_PAGES.find(item => item.systemRoute === page?.systemRoute);
  if (!definition) return page;
  if (page.nativeDesignVersion === 1) return { ...page, hybrid: true };
  const legacy = LEGACY_CORE_PAGES.find(item => item.systemRoute === page.systemRoute);
  const templateIds = new Set(legacy.components.map(section => section.id));
  return {
    ...page, hybrid: true, nativeDesignVersion: 1,
    // Retain the old template for recovery without duplicating it on the page.
    legacyTemplateComponents: page.components || [],
    components: (page.components || []).filter(section => !templateIds.has(section.id)),
  };
};

export const createSystemPage = (route) => {
  const template = SYSTEM_CORE_PAGES.find(page => page.systemRoute === route);
  if (!template) return null;
  return {
    ...template,
    components: JSON.parse(JSON.stringify(template.components)),
    status: 'published',
    author: 'Store Manager',
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    publishedAt: new Date().toISOString().slice(0, 10),
    showInNav: false,
    showInFooter: false
  };
};
