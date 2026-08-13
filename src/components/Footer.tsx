import React from 'react';
import { ShieldCheck, Heart, Mail, Phone, MapPin, HelpCircle, FileText } from 'lucide-react';

interface FooterProps {
  onSelectServiceCategory?: (categoryId: string) => void;
  onOpenFaq?: () => void;
}

export default function Footer({ onSelectServiceCategory, onOpenFaq }: FooterProps) {
  const handleServiceClick = (categoryId: string) => {
    if (onSelectServiceCategory) {
      onSelectServiceCategory(categoryId);
    }
    // Smooth scroll to service catalog desk if present or landing preview
    const targetElement = document.getElementById('services-desk') || document.getElementById('services-preview');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-white font-display font-bold text-lg tracking-tight">
              Estate<span className="text-teal-400">Connect</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bridging the gap between busy residents and verified local service providers. Premium, hyper-local domestic lifestyle services — from cozy home tuition and fresh grocery bundles to certified repair experts — delivered straight to your doorstep and integrated with your estate security rules.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
              <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
              <span>Estate-Approved Partner</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Services Cover (Click to Book)
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleServiceClick('cleaning')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Deep & Express Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('plumbing')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Licensed Plumbing Repair
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('electrical')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Residential Electrical Diagnostics
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('laundry')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Wash & Dry Clean Bundles
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('grocery')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> On-Demand Grocery Deliveries
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('tuition')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Kids Home Tuition & Homework
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick('car-services')}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Car Wash & Detailing
                </button>
              </li>
            </ul>
          </div>

          {/* Resident Guide & Support */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Resident Guide &amp; Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Common Resident Questions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Gate Security &amp; Access Guide
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Payments &amp; M-Pesa Receipts
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Verified Helper Guarantee
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFaq}
                  className="hover:text-emerald-400 text-slate-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium"
                >
                  <span className="text-emerald-500">›</span> Custom Service Requests
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Estate Support
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Serving Residents in Fedha Estate, Nairobi, KE</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                <span>0796502465 (Call / WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                <span>support@estateconnect.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} EstateConnect. All rights reserved to SmartSoftware Solutions.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-current" /> for modern estate communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
