import { CoreSectionSlot } from '../components/builder/CoreSectionSlot';
import { CORE_COLLECTIONS } from '../data/coreCollections';
import { useCoreContent } from '../components/builder/CoreContentContext';
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
  const coreContent = useCoreContent();
  const { storeInfo, showToast, submitServiceInquiry } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Bulk Order Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!contactName.trim() || !contactMessage.trim()) {
      showToast('Please enter your name and message.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitServiceInquiry({
        clientName: contactName.trim(),
        clientEmail: contactEmail.trim(),
        serviceType: contactSubject,
        notes: contactMessage.trim(),
        paperType: 'Contact inquiry',
      });
      setSubmitted(true);
      setContactMessage('');
    } catch {
      showToast('Unable to send your inquiry. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = coreContent.collection(CORE_COLLECTIONS['/contact'][0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      <CoreSectionSlot placement="before:0" />
      {/* Header */}
      <div className="border-b border-neutral-200 pb-8 text-center max-w-2xl mx-auto animate-fade-down">
        <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">{coreContent.text("content-1", "Get in Touch")}</span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">{coreContent.text("content-2", "Contact & Store Information")}</h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-light mt-2">{coreContent.text("content-3", "Have an inquiry regarding bulk orders, custom bookbinding, or school supplies? Reach out to our campus team.")}</p>
      </div>

      <CoreSectionSlot placement="before:1" />
      {/* Main Grid: Store Info Cards + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left: Store Location and Hours */}
        <div className="space-y-8 animate-fade-up delay-75">
          
          <div className="bg-[#FAF9F5] border border-neutral-300 p-8 space-y-6 card-interactive hover-lift">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">{coreContent.text("content-4", "Campus Store Location")}</h3>

            <div className="space-y-4 text-xs font-light text-neutral-700">
              <div className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">{coreContent.text("content-5", "Physical Address:")}</strong>
                  <span>{storeInfo.address}</span>
                  <p className="text-neutral-500 text-[11px] mt-0.5">{coreContent.text("content-6", "Landmark: ")}{storeInfo.landmark}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Clock className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:rotate-45 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">{coreContent.text("content-7", "Store Operating Hours:")}</strong>
                  <p>{storeInfo.hours.weekdays}</p>
                  <p>{storeInfo.hours.saturday}</p>
                  <p className="text-neutral-500">{storeInfo.hours.sunday}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Phone className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">{coreContent.text("content-8", "Direct Telephone & Hotline:")}</strong>
                  <span>{storeInfo.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <Mail className="w-4 h-4 text-black shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <strong className="text-black block font-medium">{coreContent.text("content-9", "Email Address:")}</strong>
                  <span>{storeInfo.email}</span>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-neutral-200">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-2 font-medium">{coreContent.text("content-10", "Official Channels")}</span>
              <div className="flex flex-wrap gap-3 text-xs text-neutral-600">
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">{coreContent.text("content-11", "FB: ")}{storeInfo.social.facebook}
                </span>
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">{coreContent.text("content-12", "IG: ")}{storeInfo.social.instagram}
                </span>
                <span className="bg-white px-2.5 py-1 border border-neutral-200 font-mono text-[11px] hover-lift">{coreContent.text("content-13", "Viber: ")}{storeInfo.social.viber}
                </span>
              </div>
            </div>
          </div>

          {/* Store Location Map with Satellite Pin */}
          <div className="bg-[#FAF9F5] border border-neutral-300 p-6 space-y-3 card-interactive hover-lift">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-black uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>{coreContent.text("content-14", "Banago, Nagcarlan Store Location Map")}</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider bg-black text-white px-2 py-0.5 font-medium shadow-2xs">{coreContent.text("content-15", "Store Coordinates")}</span>
            </div>
            <p className="text-[11px] text-neutral-500 font-light">{coreContent.text("content-16", "Purok 5, Along Nagcarlan–Rizal Road (30m from Plaridel Elementary & 50m from Plaridel Integrated National High School).")}</p>
            
            {/* Visual Location Map from User Satellite Data */}
            <div className="relative w-full border-2 border-neutral-300 overflow-hidden bg-neutral-900 group shadow-sm">
              <img
                data-core-field="content-17" src={coreContent("content-17", "/images/banago_store_location_map.png")}
                alt={coreContent("content-18", "Mama Mo Ink Print & Supplies - Barangay Banago, Nagcarlan, Laguna Location Map")}
                className="w-full h-auto object-cover max-h-[380px] transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] text-neutral-800 font-medium border border-neutral-300 shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{coreContent.text("content-19", "Nagcarlan - Rizal Rd (Beside Maco's)")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a 
                href="https://www.google.com/maps/search/Barangay+Banago+Nagcarlan+Laguna+Philippines" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-[#0A1A3A] font-semibold underline hover:text-black transition-colors"
              >{coreContent.text("content-20", "Open in Google Maps →")}</a>
              <span className="text-[10px] text-neutral-400 font-mono">{coreContent.text("content-21", "14°08'09.0\"N 121°24'57.0\"E")}</span>
            </div>
          </div>

        </div>

        {/* Right: Customer Inquiry Form */}
        <div className="bg-[#FAF9F5] border border-neutral-300 p-8 space-y-6 animate-fade-up delay-150 card-interactive">
          <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">{coreContent.text("content-22", "Send an Inquiry")}</h3>

          {submitted ? (
            <div className="p-8 bg-white border border-neutral-200 text-center space-y-3 animate-pop-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-editorial text-xl text-black">{coreContent.text("content-23", "Inquiry Dispatched")}</h4>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto font-light leading-relaxed">{coreContent.text("content-24", "Thank you for messaging Mama Mo Ink Print and Supplies. Our store coordinator will reply within 2 business hours.")}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs uppercase tracking-wider text-black underline font-medium hover:text-neutral-600 transition-colors"
              >{coreContent.text("content-25", "Send another message")}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-26", "Full Name *")}</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={coreContent("content-27", "Juan Miguel Santos")}
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-28", "Email Address *")}</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={coreContent("content-29", "jmsantos@sample.edu.ph")}
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-30", "Subject Category")}</label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors cursor-pointer"
                >
                  <option value="Bulk Order Inquiry">{coreContent.text("content-31", "Bulk School / Office Supplies Order")}</option>
                  <option value="Thesis Printing Inquiry">{coreContent.text("content-32", "Thesis Hardbound / Bookbinding")}</option>
                  <option value="Store Pickup Question">{coreContent.text("content-33", "In-Store Pickup Question")}</option>
                  <option value="Corporate / Faculty Invoicing">{coreContent.text("content-34", "Faculty / Institutional Invoicing")}</option>
                  <option value="General Feedback">{coreContent.text("content-35", "General Question or Feedback")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-36", "Message Details *")}</label>
                <textarea
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder={coreContent("content-37", "Good day! Inquiring about bulk discounts for 20 reams of A4 80gsm paper for our college department.")}
                  className="w-full text-xs p-3 bg-white border border-neutral-300 focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending?' : coreContent.text("content-38", "Submit Inquiry")}</span>
              </button>
            </form>
          )}
        </div>

      </div>

      <CoreSectionSlot placement="before:2" />
      {/* Frequently Asked Questions */}
      <div className="pt-8 border-t border-neutral-200 animate-fade-up delay-200">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-medium">{coreContent.text("content-39", "Common Inquiries")}</span>
          <h3 className="text-2xl font-light font-editorial text-black tracking-wide mt-1 uppercase">{coreContent.text("content-40", "Frequently Asked Questions")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6 bg-white border border-neutral-200 space-y-2 card-interactive hover-lift">
              <h4 className="text-xs font-semibold text-black leading-snug">
                {coreContent.text(`faq-${faq.id}-q`, faq.q || '')}
              </h4>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {coreContent.text(`faq-${faq.id}-a`, faq.a || '')}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
