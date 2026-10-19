// Sample realistic inventory and services for Mama Mo Ink Print and Supplies
export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'PaperOne Premium A4 Copy Paper 80gsm (500 Sheets)',
    category: 'Paper Products',
    price: 285,
    originalPrice: 320,
    stock: 45,
    isFeatured: true,
    isDiscounted: true,
    rating: 4.9,
    reviewsCount: 38,
    description: 'High-opacity, ultra-smooth premium multipurpose paper engineered for laser, inkjet printing, and high-speed photocopying. Ideal for thesis submissions and professional documents.',
    features: ['80 GSM thickness', 'ProDigi HD Print Technology', '500 sheets ream', 'Acid-free, archival quality'],
    sku: 'PAP-A4-80G',
    image: '/images/paper_one_ream.jpg',
    fallbackCategory: 'paper'
  },
  {
    id: 'prod-2',
    name: 'Pilot G-Tec-C4 Ultra Fine Gel Pen 0.4mm (Pack of 3)',
    category: 'School Supplies',
    price: 245,
    originalPrice: 280,
    stock: 60,
    isFeatured: true,
    isDiscounted: true,
    rating: 4.8,
    reviewsCount: 52,
    description: 'The iconic Japanese precision pen favored by Philippine high school, college, and engineering students. Bio-polymer ink prevents feathering and provides razor-sharp line clarity.',
    features: ['0.4mm needle point tip', 'Japanese bio-polymer ink', 'Set of 3: Black, Blue, Red', 'Textured ergonomic grip'],
    sku: 'PEN-GT-04',
    image: '/images/pilot_gtec_pens.jpg',
    fallbackCategory: 'pen'
  },
  {
    id: 'prod-3',
    name: 'Mongol Regular Pencil #2 (Box of 12)',
    category: 'School Supplies',
    price: 110,
    originalPrice: 125,
    stock: 120,
    isFeatured: false,
    isDiscounted: true,
    rating: 4.9,
    reviewsCount: 74,
    description: 'The golden standard of pencils in Philippine schools. Premium cedar wood casing with soft, smudge-free pink eraser. Certified for standard scantron examination sheets.',
    features: ['Medium soft #2 graphite lead', 'High-quality cedar wood', 'Durable pink eraser', 'PMA approved non-toxic'],
    sku: 'PEN-MG-12',
    image: '/images/mongol_pencils.jpg',
    fallbackCategory: 'pencil'
  },
  {
    id: 'prod-4',
    name: 'Epson 003 Genuine EcoTank Refill Ink Set (4 Colors)',
    category: 'Printing Materials',
    price: 1180,
    originalPrice: 1350,
    stock: 28,
    isFeatured: true,
    isDiscounted: true,
    rating: 5.0,
    reviewsCount: 41,
    description: 'Original Epson 003 dye ink bottles for L-series printers (L3110, L3150, L3210, L3250). Spill-free key-lock nozzle design ensures mess-free refills and ultra-vivid output.',
    features: ['Genuine Epson formulated dye ink', 'Yield up to 4,500 pages (Black), 7,500 pages (Color)', 'Keyed nozzle design', 'Complete 4-bottle set: BK, C, M, Y'],
    sku: 'INK-EP-003',
    image: '/images/epson_003_ink.jpg',
    fallbackCategory: 'ink'
  },
  {
    id: 'prod-5',
    name: 'Sterling Classic Hardbound Record Book (300 Pages)',
    category: 'Office Supplies',
    price: 165,
    originalPrice: 165,
    stock: 35,
    isFeatured: false,
    isDiscounted: false,
    rating: 4.7,
    reviewsCount: 19,
    description: 'Durable faux-leatherette hardbound ledger notebook with sewn bookbinding. Numbered rule lines suitable for store accounting, classroom attendance, and laboratory logs.',
    features: ['300 numbered ruled pages', 'Hardcover vinyl exterior', 'Thread-sewn binding opens flat', 'Heavy weight blue ledger paper'],
    sku: 'BOK-ST-300',
    image: '/images/sterling_record_book.jpg',
    fallbackCategory: 'notebook'
  },
  {
    id: 'prod-6',
    name: 'Deli Heavy-Duty Desk Stapler (100 Sheets)',
    category: 'Office Supplies',
    price: 480,
    originalPrice: 550,
    stock: 18,
    isFeatured: false,
    isDiscounted: true,
    rating: 4.8,
    reviewsCount: 22,
    description: 'Industrial lever-action stapler for thick book reports, legal filings, and classroom syllabus binding. Adjustable throat depth gauge from 10mm to 70mm.',
    features: ['All-metal durable body', 'Binds up to 100 sheets effortlessly', 'Uses 23/6 to 23/13 heavy duty staples', 'Non-skid base with paper guide'],
    sku: 'OFF-DL-100',
    image: '/images/deli_stapler.jpg',
    fallbackCategory: 'office'
  },
  {
    id: 'prod-7',
    name: 'Thermal Laminating Film Pouches A4 125 Microns (Pack of 100)',
    category: 'Printing Materials',
    price: 390,
    originalPrice: 440,
    stock: 40,
    isFeatured: true,
    isDiscounted: true,
    rating: 4.9,
    reviewsCount: 31,
    description: 'Crystal-clear glossy laminating pouches offering rigid protection for school IDs, certificates, diplomas, menus, and flashcards. Waterproof and tear-resistant.',
    features: ['125 microns thickness', 'A4 standard format (216 x 303mm)', 'Round corners for safety', 'Pack of 100 sheets'],
    sku: 'LAM-A4-125',
    image: '/images/laminating_film_pouches.jpg',
    fallbackCategory: 'craft'
  },
  {
    id: 'prod-8',
    name: 'Faber-Castell Classic Color Pencils (Box of 24)',
    category: 'Specialty & Craft',
    price: 295,
    originalPrice: 330,
    stock: 30,
    isFeatured: true,
    isDiscounted: true,
    rating: 4.9,
    reviewsCount: 46,
    description: 'Hexagonal color pencils with break-resistant SV bonding. Rich, highly pigmented colors ideal for art classes, science illustrations, and creative school projects.',
    features: ['24 vibrant brilliant shades', 'SV secure bonding prevents lead breakage', 'Eco-friendly sustainable wood', 'Easily sharpened with regular sharpeners'],
    sku: 'ART-FC-24',
    image: '/images/faber_castell_pencils.jpg',
    fallbackCategory: 'pencil'
  },
  {
    id: 'prod-9',
    name: 'Double-Loop Wire Binding Spines 1/2-inch (50 Pieces)',
    category: 'Printing Materials',
    price: 320,
    originalPrice: 320,
    stock: 25,
    isFeatured: false,
    isDiscounted: false,
    rating: 4.6,
    reviewsCount: 14,
    description: 'Professional twin-loop metal wire binding rings for student handbooks, calendars, thesis manuscripts, and business portfolios. 3:1 pitch ratio.',
    features: ['1/2 inch (12.7mm) diameter', 'Binds up to 90 pages of 80gsm paper', 'Sleek matte black finish', 'Pack of 50 spines'],
    sku: 'BND-WR-50',
    image: '/images/wire_binding_spines.jpg',
    fallbackCategory: 'office'
  },
  {
    id: 'prod-10',
    name: 'Post-it Pastel Sticky Notes Multi-Pack (6 Pads)',
    category: 'Office Supplies',
    price: 260,
    originalPrice: 295,
    stock: 55,
    isFeatured: false,
    isDiscounted: true,
    rating: 4.8,
    reviewsCount: 39,
    description: 'Genuine 3M Post-it notes in calming aesthetic pastel tones (sage green, soft butter, lavender, rose, sky blue). Sticks reliably without leaving glue residue.',
    features: ['3 in x 3 in standard square', '100 sheets per pad (600 sheets total)', 'Clean removal guarantee', 'Recycled plant-based adhesive'],
    sku: 'NOT-3M-06',
    image: '/images/post_it_notes.jpg',
    fallbackCategory: 'paper'
  },
  {
    id: 'prod-11',
    name: 'Carl Rotary Heavy-Duty Paper Trimmer A4',
    category: 'Printing Materials',
    price: 1450,
    originalPrice: 1680,
    stock: 12,
    isFeatured: true,
    isDiscounted: true,
    rating: 5.0,
    reviewsCount: 17,
    description: 'Precision Japanese rotary blade paper trimmer with calibrated grid base. Trims up to 20 sheets of 80gsm paper cleanly in a single gliding stroke.',
    features: ['Self-sharpening hardened steel rotary blade', 'Solid steel base with metric & imperial guides', 'Cuts paper, photos, cardstock, laminates', 'Safety locking clamp'],
    sku: 'EQP-CR-A4',
    image: '/images/paper_cutter_trimmer.jpg',
    fallbackCategory: 'office'
  },
  {
    id: 'prod-12',
    name: 'Sterling College Ruled Spiral Notebooks (Pack of 5)',
    category: 'School Supplies',
    price: 185,
    originalPrice: 210,
    stock: 70,
    isFeatured: false,
    isDiscounted: true,
    rating: 4.7,
    reviewsCount: 44,
    description: 'Essential college-ruled spiral notebooks featuring heavy poly-plastic covers that resist spills and backpack wear. 80 micro-perforated sheets of premium white ruled paper each.',
    features: ['Pack of 5 distinct color-coded notebooks', '80 micro-perforated sheets each', 'Snag-free spiral lock wire', 'Includes interior storage pockets'],
    sku: 'NOT-ST-05',
    image: '/images/spiral_notebooks.jpg',
    fallbackCategory: 'notebook'
  }
];

export const CATEGORIES = [
  'All',
  'School Supplies',
  'Office Supplies',
  'Paper Products',
  'Printing Materials',
  'Specialty & Craft'
];

export const PROMOTIONS = [
  {
    id: 'promo-1',
    title: 'ACADEMIC BACK-TO-SCHOOL BUNDLE',
    tagline: 'Equip your semester with curated essentials at 15% off.',
    code: 'STUDENT15',
    discount: '15% OFF',
    condition: 'Applicable to notebooks, pens, and paper items over ₱500',
    badge: 'Limited Academic Term Offer',
    validUntil: 'Friday, Oct 30, 2026',
    accentColor: '#121212'
  },
  {
    id: 'promo-2',
    title: 'FACULTY & CLASSROOM BULK ORDER',
    tagline: 'Order 5 reams of 80gsm A4 paper and receive 2 complimentary spiral notebook sets.',
    code: 'FACULTYPACK',
    discount: 'FREE GIFT',
    condition: 'Applicable for certified teachers and school staff',
    badge: 'Faculty Privilege',
    validUntil: 'Nov 15, 2026',
    accentColor: '#785A3C'
  },
  {
    id: 'promo-3',
    title: 'THESIS & DISSERTATION PRINT SUITE',
    tagline: 'Premium hardbound bookbinding with metallic gold hot-foil spine and front stamping.',
    code: 'THESIS2026',
    discount: '20% OFF BINDING',
    condition: 'For orders with 150+ color printed pages',
    badge: 'Graduation Special',
    validUntil: 'Nov 30, 2026',
    accentColor: '#2B3A42'
  }
];

export const PRINTING_SERVICES = [
  {
    id: 'srv-doc',
    title: 'Document Printing',
    category: 'Academic & Business',
    tagline: 'High-speed laser and inkjet printing for syllabi, reports, and reviewers.',
    startingPrice: 2.00,
    priceUnit: 'page',
    turnaround: 'Same day (within 2-4 hours)',
    specs: ['B&W Laser: ₱2.00 / page', 'Full Color: ₱6.00 - ₱12.00 / page', 'Supported: PDF, DOCX, PPTX, JPG'],
    description: 'Whether you need a single 10-page research paper or 200 copies of lecture modules, our production printers produce crisp typography and sharp graphics.'
  },
  {
    id: 'srv-photocopy',
    title: 'Photocopying & Duplicating',
    category: 'High Volume',
    tagline: 'Cost-effective high-volume duplication for hand-outs and workbooks.',
    startingPrice: 1.00,
    priceUnit: 'page',
    turnaround: 'Instant / While you wait',
    specs: ['Single-sided: ₱1.00 / page', 'Double-sided (Back-to-back): ₱1.75 / sheet', 'Paper options: 70gsm newsprint to 80gsm bond'],
    description: 'High-speed dual-sided duplex digital copiers with automatic document feeders for fast batch turnaround.'
  },
  {
    id: 'srv-hardbound',
    title: 'Thesis Hardbound Binding',
    category: 'Graduation & Archives',
    tagline: 'University-standard hardbound binding with gold or silver hot-stamped lettering.',
    startingPrice: 450.00,
    priceUnit: 'book',
    turnaround: '2 to 3 Business Days (Rush 24h available)',
    specs: ['Cover colors: Navy Blue, Maroon, Forest Green, Black, Royal Gold', 'Front & Spine gold hot foil embossing', 'Ribbon bookmark included', 'Acid-free binding glue'],
    description: 'Compliant with CHED and university thesis formatting guidelines for undergrad, masteral, and doctoral dissertations.'
  },
  {
    id: 'srv-ring',
    title: 'Spiral & Wire-O Binding',
    category: 'Binding & Finishing',
    tagline: 'Flexible binding with frosted PVC protective transparent covers.',
    startingPrice: 50.00,
    priceUnit: 'book',
    turnaround: '15 to 30 minutes',
    specs: ['Plastic coil or double-loop metal wire', 'Front frosted clear cover & back leatherette board', 'Capacity up to 350 sheets'],
    description: 'Perfect for laboratory manuals, reviewer compilations, cookery recipe books, and school projects.'
  },
  {
    id: 'srv-laminating',
    title: 'Heavy Thermal Lamination',
    category: 'Protection',
    tagline: 'Waterproof 125-250 micron protective seal for IDs and documents.',
    startingPrice: 25.00,
    priceUnit: 'item',
    turnaround: '10 minutes',
    specs: ['ID Size: ₱25.00', 'Short/Letter/A4 Size: ₱40.00', 'Long/Legal Size: ₱50.00'],
    description: 'High-heat multi-roller lamination guaranteeing bubble-free seal and lifetime water/crease resistance.'
  },
  {
    id: 'srv-stickers',
    title: 'Custom Sticker & Label Printing',
    category: 'Specialty Products',
    tagline: 'Precision kiss-cut decals for school projects, small business, and tumbler labels.',
    startingPrice: 55.00,
    priceUnit: 'A4 sheet',
    turnaround: '24 hours',
    specs: ['Glossy Photo Sticker, Matte Vinyl, or Waterproof Transparent', 'Machine contour kiss-cut included', 'High UV-resistant pigment ink'],
    description: 'Turn your design or logo into vibrant peel-and-stick labels. Ideal for student organization merch and enterprise labeling.'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'MM-2026-1042',
    date: '2026-10-18T14:30:00Z',
    customer: {
      name: 'Teacher Maria Santos',
      email: 'm.santos@plaridel.deped.gov.ph',
      phone: '0917-882-9411',
      type: 'Educator / Faculty'
    },
    fulfillment: 'delivery',
    deliveryAddress: 'Faculty Room, Plaridel Elementary School, Banago, Nagcarlan, Laguna 4002',
    paymentMethod: 'GCash (Ref # 99281746)',
    status: 'Out for Delivery',
    statusNotes: 'Staff on the way across Nagcarlan-Rizal Road to deliver directly to faculty room.',
    items: [
      { id: 'prod-1', name: 'PaperOne Premium A4 Copy Paper 80gsm (500 Sheets)', price: 285, quantity: 3 },
      { id: 'prod-10', name: 'Post-it Pastel Sticky Notes Multi-Pack (6 Pads)', price: 260, quantity: 2 },
      { id: 'prod-6', name: 'Deli Heavy-Duty Desk Stapler (100 Sheets)', price: 480, quantity: 1 }
    ],
    subtotal: 1855,
    discountAmount: 185,
    deliveryFee: 0,
    total: 1670
  },
  {
    id: 'MM-2026-1038',
    date: '2026-10-19T09:15:00Z',
    customer: {
      name: 'Juan Dela Cruz',
      email: 'juan.delacruz@pinhs.edu.ph',
      phone: '0928-554-1290',
      type: 'High School Student'
    },
    fulfillment: 'pickup',
    pickupLocation: 'Mama Mo Main Store (Ground Floor Express Counter, Banago, Nagcarlan)',
    pickupTimeSlot: 'Today, 4:00 PM - 5:00 PM (After Dismissal)',
    paymentMethod: 'Cash on Pickup',
    status: 'Ready for Pickup',
    statusNotes: 'Items packed in paper shopping bag. Waiting at Ground Floor Cashier counter.',
    items: [
      { id: 'prod-2', name: 'Pilot G-Tec-C4 Ultra Fine Gel Pen 0.4mm (Pack of 3)', price: 245, quantity: 1 },
      { id: 'prod-12', name: 'Sterling College Ruled Spiral Notebooks (Pack of 5)', price: 185, quantity: 1 },
      { id: 'prod-3', name: 'Mongol Regular Pencil #2 (Box of 12)', price: 110, quantity: 1 }
    ],
    subtotal: 540,
    discountAmount: 0,
    deliveryFee: 0,
    total: 540
  },
  {
    id: 'MM-2026-1025',
    date: '2026-10-17T11:00:00Z',
    customer: {
      name: 'Elena Ramos',
      email: 'elena.ramos@banago.gov.ph',
      phone: '0908-123-4567',
      type: 'Local Resident / Office'
    },
    fulfillment: 'delivery',
    deliveryAddress: 'Purok 3, Barangay Banago, Nagcarlan, Laguna 4002 (Near Barangay Hall)',
    paymentMethod: 'Maya (Ref # 41829013)',
    status: 'Completed',
    statusNotes: 'Delivered and received with signed proof of receipt.',
    items: [
      { id: 'prod-4', name: 'Epson 003 Genuine EcoTank Refill Ink Set (4 Colors)', price: 1180, quantity: 1 },
      { id: 'prod-7', name: 'Thermal Laminating Film Pouches A4 125 Microns', price: 390, quantity: 2 }
    ],
    subtotal: 1960,
    discountAmount: 100,
    deliveryFee: 30,
    total: 1890
  }
];

export const INITIAL_SERVICE_INQUIRIES = [
  {
    id: 'SRV-INQ-501',
    date: '2026-10-19T08:45:00Z',
    clientName: 'Alyssa Valdez',
    clientPhone: '0919-482-1922',
    clientEmail: 'alyssa.v@gradschool.edu',
    serviceType: 'Thesis Hardbound Binding',
    pageCount: 168,
    paperType: '80gsm Premium White',
    bindingDetails: 'Maroon Cover with Embossed Gold Lettering on Spine & Front',
    quantity: 3,
    estimatedCost: 1850,
    notes: 'Please verify title page formatting spacing according to our thesis manual.',
    status: 'In Review'
  },
  {
    id: 'SRV-INQ-502',
    date: '2026-10-19T10:20:00Z',
    clientName: 'Coach Ryan Mendoza',
    clientPhone: '0922-311-8899',
    clientEmail: 'ryan.m@varsityclub.org',
    serviceType: 'Custom Sticker & Label Printing',
    pageCount: 15,
    paperType: 'Waterproof Matte Vinyl',
    bindingDetails: 'Circular 2-inch kiss-cut stickers for team drink bottles',
    quantity: 15,
    estimatedCost: 825,
    notes: 'High-res AI vector file submitted.',
    status: 'Approved & Printing'
  }
];

export const STORE_INFO = {
  name: 'Mama Mo Ink Print and Supplies',
  tagline: 'Plumang abot kaya, dito lang yan kay Mama',
  subtitle: 'Convenient one-stop retail store for quality school supplies and student-friendly printing services.',
  address: 'Purok 5, Barangay Banago, Nagcarlan, Laguna 4002',
  landmark: 'Along Nagcarlan–Rizal Road (30m from Plaridel Elementary & 50m from Plaridel Integrated National High School)',
  phone: '+63 917 882 6262',
  email: 'hello@mamamoinkprint.ph',
  established: 2026,
  classSection: '4BSBA-MM1',
  advisor: 'Sir Guillermo Briones',
  teamMembers: [
    { name: 'Celerio Anne Francine', role: 'Store Manager / Operations Lead' },
    { name: 'Bagatao Pia Maureen M.', role: 'Retail Strategy & Marketing' },
    { name: 'Brit Margaret M.', role: 'Inventory Sourcing & Procurement' },
    { name: 'Corpuz Sarah Jean L.', role: 'Financial Planning & Pricing' },
    { name: 'Ignacio Angela D.', role: 'Customer Experience & Quality Control' }
  ],
  mission: 'To provide fast, reliable, and high-quality printing services together with complete school supplies at a price range that is affordable to all students and to cater to the needs of customers without making them waste their time and money.',
  vision: 'To be known to the community of Banago, Nagcarlan, as the most reliable and preferred school supply provider that offers convenience and affordability in purchasing school supplies and dependable customer service that will cater to the needs of every learner.',
  usp: [
    'Multichannel Access: Physical store & online ordering',
    'Student Friendly Rates: Affordable pricing fitting daily student allowances',
    'Dual Services in One Stop: Full school supplies + comprehensive print shop'
  ],
  hours: {
    weekdays: 'Monday – Friday: 7:00 AM – 6:30 PM (Aligned with school hours)',
    saturday: 'Saturday: 8:00 AM – 5:00 PM',
    sunday: 'Sunday: Closed (Online orders queued for Monday morning)'
  },
  social: {
    facebook: 'facebook.com/MamaMoInkPrintSupplies',
    instagram: '@mamamo_supplies',
    viber: 'Mama Mo Print Express Community'
  }
};
