import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const { storeInfo, showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Bulk Order Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to our customer desk!', 'success');
  };

  const faqs = [
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 text-center max-w-2xl mx-auto animate-fade-down">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
          Contact &amp; Store Information
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2">
          Have an inquiry regarding bulk orders, custom bookbinding, or school supplies? Reach out to our campus team.
        </p>
      </div>

      {/* Main Grid: Store Info Cards + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Store Location and Hours */}
        <div className="space-y-8 animate-fade-up delay-75">
          
          <div className="bg-[#FAF9F5] border border-neutral-300 p-8 space-y-6 card-interactive hover-lift">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
              Campus Store Location
            </h3>

            <div className="space-y-4 text-xs font-light text-neutral-700">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">Physical Address:</strong>
                  <span>{storeInfo.address}</span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Landmark: {storeInfo.landmark}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Clock className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:rotate-45 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">Store Operating Hours:</strong>
                  <p>{storeInfo.hours.weekdays}</p>
                  <p>{storeInfo.hours.saturday}</p>
                  <p className="text-neutral-500">{storeInfo.hours.sunday}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Phone className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">Direct Telephone &amp; Hotline:</strong>
                  <span>{storeInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">Email Address:</strong>
                  <span>{storeInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-neutral-200">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-medium">
                Official Channels
              </span>
              <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">
                  FB: {storeInfo.social.facebook}
                </span>
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">
                  IG: {storeInfo.social.instagram}
                </span>
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">
                  Viber: {storeInfo.social.viber}
                </span>
              </div>
            </div>
          </div>

          {/* Store Location Map with Satellite Pin */}
          <div className="bg-[#FAF9F5] border border-neutral-300 p-6 space-y-3 card-interactive hover-lift">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-black uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Banago, Nagcarlan Store Location Map</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider bg-black text-white px-2 py-0.5 font-medium shadow-2xs">
                Store Coordinates
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 font-light">
              Purok 5, Along Nagcarlan–Rizal Road (30m from Plaridel Elementary &amp; 50m from Plaridel Integrated National High School).
            </p>
            
            {/* Visual Location Map from User Satellite Data */}
            <div className="relative w-full border-2 border-neutral-300 overflow-hidden bg-neutral-900 group shadow-sm">
              <img
                src="/images/banago_store_location_map.png"
                alt="Mama Mo Ink Print & Supplies - Barangay Banago, Nagcarlan, Laguna Location Map"
                className="w-full h-auto object-cover max-h-[380px] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] text-neutral-800 font-medium border border-neutral-300 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Nagcarlan - Rizal Rd (Beside Maco's)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a 
                href="https://www.google.com/maps/search/Barangay+Banago+Nagcarlan+Laguna+Philippines" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-[#0A1A3A] font-semibold underline hover:text-black transition-colors"
              >
                Open in Google Maps →
              </a>
              <span className="text-[10px] text-neutral-400 font-mono">
                14°08'09.0"N 121°24'57.0"E
              </span>
            </div>
          </div>

        </div>

        {/* Right: Customer Inquiry Form */}
        <div className="bg-[#FAF9F5] border border-neutral-300 p-8 space-y-6 animate-fade-up delay-150 card-interactive">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">
            Send an Inquiry
          </h3>

          {submitted ? (
            <div className="p-8 bg-white border border-neutral-200 text-center space-y-3 animate-pop-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-editorial text-xl text-black">Inquiry Dispatched</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto font-light leading-relaxed">
                Thank you for messaging Mama Mo Ink Print and Supplies. Our store coordinator will reply within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs uppercase tracking-wider text-black underline font-medium hover:text-neutral-600 transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Juan Miguel Santos"
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jmsantos@sample.edu.ph"
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Subject Category
                </label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors cursor-pointer"
                >
                  <option value="Bulk Order Inquiry">Bulk School / Office Supplies Order</option>
                  <option value="Thesis Printing Inquiry">Thesis Hardbound / Bookbinding</option>
                  <option value="Store Pickup Question">In-Store Pickup Question</option>
                  <option value="Corporate / Faculty Invoicing">Faculty / Institutional Invoicing</option>
                  <option value="General Feedback">General Question or Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Good day! Inquiring about bulk discounts for 20 reams of A4 80gsm paper for our college department."
                  className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-8 border-t border-neutral-200 animate-fade-up delay-200">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
            Common Inquiries
          </span>
          <h3 className="text-2xl font-light font-editorial text-black tracking-wide mt-1 uppercase">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-6 bg-white border border-neutral-200 space-y-2 card-interactive hover-lift">
              <h4 className="text-xs font-semibold text-black leading-snug">
                {faq.q}
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
