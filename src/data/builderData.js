// Default data for Mama Mo Website Builder, Dynamic Pages, Navigation, Media Library & Inventory Ledger

export const INITIAL_NAV_CONFIG = {
  headerNav: [
    { id: 'nav-home', label: 'Home', path: 'home', isCustom: false, visible: true, order: 1 },
    { id: 'nav-shop', label: 'Shop', path: 'shop', isCustom: false, visible: true, order: 2 },
    { id: 'nav-promotions', label: 'Promotions', path: 'promotions', isCustom: false, visible: true, order: 3 },
    { id: 'nav-services', label: 'Printing Services', path: 'services', isCustom: false, visible: true, order: 4 },
    { id: 'nav-tracking', label: 'Track Order', path: 'tracking', isCustom: false, visible: true, order: 5 },
    { id: 'nav-about', label: 'About Us', path: 'about', isCustom: false, visible: true, order: 6 },
    { id: 'nav-contact', label: 'Contact', path: 'contact', isCustom: false, visible: true, order: 7 }
  ],
  footerNav: [
    { id: 'fnav-shop', label: 'All Products', path: 'shop', isCustom: false, visible: true, order: 1 },
    { id: 'fnav-promos', label: 'Active Promotions', path: 'promotions', isCustom: false, visible: true, order: 2 },
    { id: 'fnav-services', label: 'Thesis & Printing', path: 'services', isCustom: false, visible: true, order: 3 },
    { id: 'fnav-tracking', label: 'Order Tracking', path: 'tracking', isCustom: false, visible: true, order: 4 },
    { id: 'fnav-about', label: 'Our Story', path: 'about', isCustom: false, visible: true, order: 5 },
    { id: 'fnav-contact', label: 'Banago Store Location', path: 'contact', isCustom: false, visible: true, order: 6 }
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
          imageUrl: 'https://images.unsplash.com/photo-1585336261026-40742f15923b?auto=format&fit=crop&w=800&q=80',
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
    url: 'https://images.unsplash.com/photo-1585336261026-40742f15923b?auto=format&fit=crop&w=800&q=80',
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
