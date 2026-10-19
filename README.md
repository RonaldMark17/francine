# Mama Mo Ink Print and Supplies — E-Commerce & Omnichannel Web Platform

> **Academic Project Prototype**  
> Developed for Academic Defense & Presentation (Friday Morning)  
> Visual Style: Minimalist Luxury Editorial inspired by Celine  

---

## 🌟 Project Overview

**Mama Mo Ink Print and Supplies** is an omnichannel retail and printing services platform tailored to the university community of Sampaloc, Manila (University Belt). The website bridges brick-and-mortar campus retail with online digital convenience, enabling students, teachers, and local offices to:

1. **Browse & Search Catalog:** Everyday essentials (PaperOne copy paper, Pilot G-Tec pens, Mongol pencils, EcoTank inks, and binding supplies) with prices in Philippine Pesos (₱).
2. **Avail Academic Discounts:** Built-in promotional system (e.g., `STUDENT15` for 15% off).
3. **Omnichannel Fulfillment:** Choose between **In-Store Pickup** (Counter 2 Express Pickup) and **Local Courier Delivery** (Metro Manila / Campus gates).
4. **Order Tracking System:** Real-time demonstration order tracking across lifecycle statuses (*Order Placed*, *Processing*, *Ready for Pickup*, *Out for Delivery*, *Completed*).
5. **Interactive Print Estimator:** Self-service calculator for document laser printing, thesis hardbound binding with gold lettering, bookbinding, photocopying, and laminating with safe file upload validation.
6. **Integrated Admin Portal:** Manage products, update prices/inventory stocks, review orders, update fulfillment statuses, and manage print inquiries.
7. **Built-in Presenter Guide & Demo Script:** Direct modal button on the navigation bar providing the presenter with a verbatim speech script and clickthrough checklist during the academic defense.

---

## 🎨 Visual Identity & Design Principles

Inspired by the clean editorial elegance of **Celine**:
- **Generous Whitespace & Asymmetry:** Uncluttered layouts that elevate everyday school supplies.
- **Editorial Typography:** High-contrast serif headlines paired with ultra-clean modern sans body text (`Cormorant Garamond` + `Plus Jakarta Sans`).
- **Harmonious Neutral Palette:** Warm white (`#FAF9F5`), charcoal black (`#121212`), muted stone (`#737373`), and subtle gold accents.
- **Polished Micro-Interactions:** Subtle hover zooms, slide-over bag drawer, celebration confetti on order submission, and real-time calculation counters.

---

## 🚀 How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Clone or Navigate to Directory
```bash
cd c:\Users\ronal\OneDrive\Desktop\Francine
```

### Step 2: Install Dependencies (If not already installed)
```bash
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```

The application will start immediately at:
```
http://localhost:5173/
```

### Step 4: Build for Production (Optional)
```bash
npm run build
npm run preview
```

---

## 🧭 Step-by-Step Presentation & Navigation Guide

Use this suggested 3-minute sequence during your academic defense presentation:

| Step | Action | What to Explain to the Panel |
|---|---|---|
| **1. Homepage** | Open `http://localhost:5173/` | Point out the Celine-inspired typography, brand identity, and the omnichannel value proposition: *"Everything You Need, All in One Place."* |
| **2. Shop & Catalog** | Click **"Shop"** in the top navigation | Show the real-time search (type *"PaperOne"*), category pills (*"Paper Products"*), price slider, and stock indicators with ₱ pricing. |
| **3. Product Details** | Click **"Details"** on any product card | Point out technical specs, authentic stock availability, quantity controls, and click **"Add to Bag"**. |
| **4. Shopping Bag & Promo** | Click the **Shopping Bag icon** | Enter coupon code `STUDENT15` and click **"Apply"**. Show the panel that 15% discount is automatically deducted in ₱. |
| **5. Checkout Workflow** | Click **"Proceed to Checkout"** | Demonstrate the omnichannel distinction: **In-Store Pickup** (Counter 2 Express) vs. **Local Courier Delivery** (+₱60). Complete the simulated order. |
| **6. Celebration & Confirmation** | Submit Order | Highlight the confetti confirmation, generated order reference (e.g. `MM-2026-1042`), and click **"Track This Order"**. |
| **7. Real-Time Order Tracking** | View Tracking Page | Walk the panel through the dynamic timeline bar (*Order Placed* → *Processing* → *Ready for Pickup* → *Completed*). |
| **8. Printing Services** | Click **"Printing Services"** | Show the **Interactive Price Estimator**: adjust pages, thesis hardbound binding with gold foil, paper weight, and see the live ₱ cost calculation. |
| **9. Admin Portal** | Click **"Admin"** on the top right | Demonstrate that the store owner can edit prices, manage stock, view customer orders, and update statuses from *Processing* to *Ready for Pickup*. |

> **Pro-Tip:** You can click the **"Demo Guide"** button in the website header at any time during practice or the defense to read the full verbatim speech script on-screen!

---

## 🛠️ Implemented Features vs Simulated Functionality

| Feature | Implementation Details |
|---|---|
| **Product Catalog** | Fully functional with local persistence (`localStorage`), real-time search, category filtering, price sliders, and sorting. |
| **Shopping Cart** | Functional add/remove/quantity updates, subtotal, promotional discount deduction, and persistent state. |
| **Checkout Flow** | Simulated omnichannel flow with In-Store Pickup time slots and Delivery address capture. No real credit card or bank API connected. |
| **Payments** | Simulated Cash on Pickup, COD, GCash (reference code validation), and Maya. |
| **Order Tracking** | Fully functional local status timeline connected directly to the order database. |
| **Printing Calculator** | Dynamic live mathematical cost engine based on service, paper weight, color mode, page count, and binding finish. |
| **Safe File Upload** | Front-end extension and file size validator (PDF, DOCX, PPTX, JPG under 25MB) with metadata preview. |
| **Admin Dashboard** | Fully functional product CRUD (Add, Edit, Delete, Update Price/Stock), order status updates, and inquiry management. |

---

## 📋 Information Requiring Actual Business Confirmation

Before any actual commercial production deployment, the business owner should provide:
1. Official registered business TIN and BIR invoicing format.
2. Official merchant payment gateway credentials (e.g., PayMongo, GCash Enterprise, or Maya Business API keys).
3. Partner logistics agreement (e.g., Lalamove, GrabExpress, or Borzo API credentials).
4. Physical high-resolution photography of the actual store counter and production machinery.
5. Final verified inventory SKU list and wholesale cost margins.

---

## 👥 Credits
- **Course / Project:** Academic Capstone / E-Commerce Retail Prototype  
- **Brand:** Mama Mo Ink Print and Supplies  
- **Location:** Sampaloc, Manila, Philippines  
