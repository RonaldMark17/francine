import { useCoreContent } from '../components/builder/CoreContentContext';
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRINTING_SERVICES } from '../data/initialData';
import { 
  Printer, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Calculator, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Paperclip
} from 'lucide-react';

export default function PrintingServicesPage() {
  const coreContent = useCoreContent();
  const { submitServiceInquiry, showToast } = useApp();

  // Interactive Calculator State
  const [calcService, setCalcService] = useState('Document Printing');
  const [calcPrintMode, setCalcPrintMode] = useState('bw'); // 'bw' | 'color-standard' | 'color-photo'
  const [calcPaperSize, setCalcPaperSize] = useState('A4'); // 'Letter' | 'A4' | 'Legal'
  const [calcPaperWeight, setCalcPaperWeight] = useState('80gsm'); // '70gsm' | '80gsm' | 'cardstock'
  const [calcPages, setCalcPages] = useState(25);
  const [calcCopies, setCalcCopies] = useState(1);
  const [calcBinding, setCalcBinding] = useState('none'); // 'none' | 'staple' | 'spiral' | 'hardbound'

  // Inquiry Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  // Compute live estimated cost in Philippine Pesos
  const calculateEstimatedTotal = () => {
    let perPage = 2.0;

    if (calcService === 'Document Printing') {
      if (calcPrintMode === 'bw') perPage = calcPaperWeight === '80gsm' ? 2.5 : 2.0;
      else if (calcPrintMode === 'color-standard') perPage = calcPaperWeight === '80gsm' ? 7.0 : 6.0;
      else perPage = 12.0; // photo quality
    } else if (calcService === 'Photocopying & Duplicating') {
      perPage = 1.0;
    } else if (calcService === 'Custom Sticker & Label Printing') {
      return calcCopies * 55; // per A4 sheet
    } else if (calcService === 'Heavy Thermal Lamination') {
      return calcCopies * (calcPaperSize === 'Legal' ? 50 : 40);
    }

    let bindingCost = 0;
    if (calcBinding === 'spiral') bindingCost = 65;
    else if (calcBinding === 'hardbound') bindingCost = 550;
    else if (calcBinding === 'staple') bindingCost = 5;

    const basePrintCost = perPage * calcPages * calcCopies;
    return Math.round(basePrintCost + (bindingCost * calcCopies));
  };

  const estimatedTotal = calculateEstimatedTotal();

  // File Upload Validation
  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc|pptx|jpg|png)$/i)) {
      setFileError('Invalid file format. Please upload PDF, Word (.docx), PPT, or High-res JPG/PNG.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setFileError('File exceeds 25MB presentation limit.');
      return;
    }

    setSelectedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document'
    });
    showToast(`Attached "${file.name}"`, 'info');
  };

  const handleSubmitInquiry = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Please enter your name and phone number', 'error');
      return;
    }

    const inquiryPayload = {
      clientName,
      clientPhone,
      clientEmail,
      serviceType: calcService,
      pageCount: calcPages,
      paperType: `${calcPaperSize} (${calcPaperWeight})`,
      bindingDetails: calcBinding === 'hardbound' 
        ? 'Thesis Hardbound with Gold Stamping' 
        : calcBinding === 'spiral' 
        ? 'PVC Frosted Spiral Binding' 
        : calcBinding === 'staple' 
        ? 'Corner Heavy Staple' 
        : 'Loose Sheets / None',
      quantity: calcCopies,
      estimatedCost: estimatedTotal,
      attachedFileName: selectedFile ? selectedFile.name : 'Sample_Thesis_Chapter1.pdf',
      notes: specialInstructions
    };

    const newInq = submitServiceInquiry(inquiryPayload);
    setSubmittedInquiry(newInq);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 animate-fade-down">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[#0A1A3A] font-semibold">{coreContent.text("content-1", "Ground Floor Printing Counter • Banago, Nagcarlan")}</span>
        <h1 className="text-3xl sm:text-4xl font-light font-editorial text-black tracking-wide mt-1 uppercase">{coreContent.text("content-2", "Printing, Copying & Document Finishing Services")}</h1>
        <p className="text-xs sm:text-sm text-neutral-600 font-light mt-2 max-w-2xl leading-relaxed">{coreContent.text("content-3", "Fast, reliable, and high-quality printing services tailored for students and educators in Banago, Nagcarlan (steps from Plaridel Elementary and Plaridel Integrated National High School). Upload your file online for express queueing, or visit our ground floor computer station.")}</p>
      </div>

      {/* Services Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up delay-100">
        {PRINTING_SERVICES.map((srv, idx) => (
          <div
            key={srv.id}
            className="bg-[#FAF9F5] border border-neutral-300 p-6 flex flex-col justify-between space-y-6 hover:border-black transition-all hover-lift card-interactive group"
            style={{ animationDelay: `${(idx + 1) * 75}ms` }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                  {srv.category}
                </span>
                <span className="text-xs font-semibold text-black bg-white px-2 py-0.5 border border-neutral-200">{coreContent.text("content-4", "₱")}{srv.startingPrice.toFixed(2)}{coreContent.text("content-5", " / ")}{srv.priceUnit}
                </span>
              </div>

              <h3 className="font-editorial text-xl text-black leading-snug group-hover:text-amber-900 transition-colors">
                {srv.title}
              </h3>

              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {srv.description}
              </p>

              <div className="pt-2 border-t border-neutral-200 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium text-neutral-800">{coreContent.text("content-6", "Turnaround:")}</span> {srv.turnaround}
                </div>
                <ul className="pt-1 space-y-1 text-[11px] text-neutral-500 font-light list-disc list-inside">
                  {srv.specs.map((sp, idx) => (
                    <li key={idx}>{sp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => {
                setCalcService(srv.title);
                window.scrollTo({ top: 750, behavior: 'smooth' });
              }}
              className="w-full py-2.5 bg-white border border-neutral-300 hover:border-black hover:bg-neutral-900 hover:text-white text-black text-xs uppercase tracking-wider font-medium transition-all active:scale-95 shadow-2xs"
            >{coreContent.text("content-7", "Calculate & Request This Service")}</button>
          </div>
        ))}
      </div>

      {/* INTERACTIVE PRICE ESTIMATOR & INQUIRY FORM */}
      <div className="bg-[#FAF9F5] border border-neutral-300 p-6 sm:p-10">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-neutral-500 mb-1">
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">{coreContent.text("content-8", "Self-Service Print Calculator")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light font-editorial text-black tracking-wide uppercase">{coreContent.text("content-9", "Estimate Cost & Submit Print Request")}</h2>
          <p className="text-xs text-neutral-600 font-light mt-1">{coreContent.text("content-10", "Select your project specifications below. The calculated fee is in Philippine Pesos (₱). Submit your file to queue it at our express counter.")}</p>
        </div>

        {submittedInquiry ? (
          /* Confirmation of service request */
          <div className="p-8 bg-white border border-neutral-200 text-center space-y-4 max-w-lg mx-auto animate-fade-in">
            <div className="w-12 h-12 mx-auto bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-black">{coreContent.text("content-11", "Inquiry Submitted!")}</h3>
            <div className="text-xs text-neutral-600 font-light leading-relaxed">{coreContent.text("content-12", "Your inquiry reference number is ")}<strong className="font-mono font-bold text-black">{submittedInquiry.id}</strong>{coreContent.text("content-13", ". Estimated total is ")}<strong className="font-semibold text-black">{coreContent.text("content-14", "₱")}{submittedInquiry.estimatedCost.toLocaleString()}</strong>{coreContent.text("content-15", ". Our print specialist will review your document and notify you via SMS/Email.")}</div>
            <button
              onClick={() => setSubmittedInquiry(null)}
              className="mt-4 px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
            >{coreContent.text("content-16", "Submit Another Print Request")}</button>
          </div>
        ) : (
          <form onSubmit={handleSubmitInquiry} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Calculation Parameters */}
            <div className="space-y-5 bg-white p-6 border border-neutral-200">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">{coreContent.text("content-17", "1. Project Specifications")}</h3>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-18", "Service Type")}</label>
                <select
                  value={calcService}
                  onChange={(e) => setCalcService(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                >
                  <option value="Document Printing">{coreContent.text("content-19", "Document Printing (Laser / Inkjet)")}</option>
                  <option value="Photocopying & Duplicating">{coreContent.text("content-20", "Photocopying & Duplicating")}</option>
                  <option value="Thesis Hardbound Binding">{coreContent.text("content-21", "Thesis Hardbound Bookbinding")}</option>
                  <option value="Spiral & Wire-O Binding">{coreContent.text("content-22", "Spiral & Wire-O Binding")}</option>
                  <option value="Heavy Thermal Lamination">{coreContent.text("content-23", "Heavy Thermal Lamination")}</option>
                  <option value="Custom Sticker & Label Printing">{coreContent.text("content-24", "Custom Sticker & Label Printing")}</option>
                </select>
              </div>

              {/* Print Mode & Color */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-25", "Print Mode / Coverage")}</label>
                <select
                  value={calcPrintMode}
                  onChange={(e) => setCalcPrintMode(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                >
                  <option value="bw">{coreContent.text("content-26", "Black & White (Standard Text / Reviewers)")}</option>
                  <option value="color-standard">{coreContent.text("content-27", "Colored (Text with Graphics / Charts)")}</option>
                  <option value="color-photo">{coreContent.text("content-28", "Full Color High-Density / Photo Quality")}</option>
                </select>
              </div>

              {/* Paper Size & Paper Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-29", "Paper Size")}</label>
                  <select
                    value={calcPaperSize}
                    onChange={(e) => setCalcPaperSize(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                  >
                    <option value="A4">{coreContent.text("content-30", "A4 (210 x 297mm)")}</option>
                    <option value="Letter">{coreContent.text("content-31", "Short / Letter (8.5 x 11\")")}</option>
                    <option value="Legal">{coreContent.text("content-32", "Long / Legal (8.5 x 13\")")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-33", "Paper Weight")}</label>
                  <select
                    value={calcPaperWeight}
                    onChange={(e) => setCalcPaperWeight(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                  >
                    <option value="70gsm">{coreContent.text("content-34", "70 GSM Standard Bond")}</option>
                    <option value="80gsm">{coreContent.text("content-35", "80 GSM Premium PaperOne")}</option>
                    <option value="cardstock">{coreContent.text("content-36", "230 GSM Heavy Cardstock")}</option>
                  </select>
                </div>
              </div>

              {/* Binding Options */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-37", "Finishing & Binding")}</label>
                <select
                  value={calcBinding}
                  onChange={(e) => setCalcBinding(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black"
                >
                  <option value="none">{coreContent.text("content-38", "No Binding (Loose Collated Sheets)")}</option>
                  <option value="staple">{coreContent.text("content-39", "Corner Heavy Staple (+₱5)")}</option>
                  <option value="spiral">{coreContent.text("content-40", "Frosted PVC Spiral Ring Binding (+₱65)")}</option>
                  <option value="hardbound">{coreContent.text("content-41", "Thesis Hardbound with Gold Foil Lettering (+₱550)")}</option>
                </select>
              </div>

              {/* Pages and Copies */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-42", "Number of Pages")}</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={calcPages}
                    onChange={(e) => setCalcPages(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-43", "Number of Copies / Sets")}</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={calcCopies}
                    onChange={(e) => setCalcCopies(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black font-mono"
                  />
                </div>
              </div>

              {/* Real-time calculated estimate display */}
              <div className="p-4 bg-[#FAF9F5] border border-neutral-300 flex items-center justify-between card-interactive">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-medium">{coreContent.text("content-44", "Estimated Cost")}</span>
                  <span 
                    key={estimatedTotal} 
                    className="text-xl font-bold text-black font-mono inline-block animate-pop-in"
                  >{coreContent.text("content-45", "₱")}{estimatedTotal.toLocaleString()}{coreContent.text("content-46", ".00")}</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-light text-right max-w-[120px]">{coreContent.text("content-47", "Subject to file inspection upon reception")}</span>
              </div>
            </div>

            {/* Right Column: Customer Details & Safe File Upload */}
            <div className="space-y-5 bg-white p-6 border border-neutral-200 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400">{coreContent.text("content-48", "2. Customer & File Details")}</h3>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-49", "Your Full Name *")}</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black transition-colors"
                    placeholder={coreContent("content-50", "Bea Alonzo")}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-51", "Contact Phone *")}</label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black transition-colors font-mono"
                      placeholder={coreContent("content-52", "0918-772-1092")}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-53", "Email Address")}</label>
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-black transition-colors"
                      placeholder={coreContent("content-54", "bea.alonzo@pinhs.edu.ph")}
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-55", "Attach Document File (Optional)")}</label>
                  <label className="group border-2 border-dashed border-neutral-300 hover:border-black transition-all p-4 flex flex-col items-center justify-center cursor-pointer bg-[#FAF9F5] hover:bg-white text-center hover-lift">
                    <UploadCloud className="w-6 h-6 text-neutral-400 group-hover:text-black group-hover:-translate-y-1 transition-all mb-1" />
                    <span className="text-xs font-medium text-black">{coreContent.text("content-56", "Click to choose document or drop file")}</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">{coreContent.text("content-57", "PDF, DOCX, PPTX, or JPG (Max 25MB)")}</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.doc,.pptx,.jpg,.png"
                    />
                  </label>

                  {selectedFile && (
                    <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Paperclip className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{selectedFile.name}</span>
                        <span className="text-[10px] text-neutral-500">{coreContent.text("content-58", "(")}{selectedFile.size}{coreContent.text("content-59", ")")}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-red-600 hover:underline text-[10px] ml-2"
                      >{coreContent.text("content-60", "Remove")}</button>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-[11px] text-red-500 mt-1">{fileError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">{coreContent.text("content-61", "Special Instructions / Spine Lettering Details")}</label>
                  <textarea
                    rows="3"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full text-xs p-3 border border-neutral-300 bg-white focus:outline-none focus:border-black transition-colors"
                    placeholder={coreContent("content-62", "Front and back print on 80gsm paper please. Bound with black coil.")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                >{coreContent.text("content-63", "Submit Service Request (₱")}{estimatedTotal.toLocaleString()}{coreContent.text("content-64", ")")}</button>
                <p className="text-[10px] text-center text-neutral-400 mt-2 font-light">{coreContent.text("content-65", "Request will be logged directly into the store's Admin portal queue.")}</p>
              </div>

            </div>

          </form>
        )}
      </div>

    </div>
  );
}
