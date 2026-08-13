import React from 'react';
import { X, HelpCircle, Phone, Heart } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does EstateConnect help me as a resident?',
      a: 'We bring trusted, verified domestic helpers right to your doorstep in Fedha Estate and Nairobi. Whether you need a quick home cleaning, plumbing fix, water refill, gas delivery, or tutoring for your kids, we connect you directly with reliable neighborhood professionals.'
    },
    {
      q: 'How do I book a service for the first time?',
      a: 'It’s super simple! Browse through our services, tap "Schedule Service", pick a date and time that works best for you, put in your house number, and hit "Request Quote & Book". You’ll instantly receive a confirmation slip for your records.'
    },
    {
      q: 'How do payments work?',
      a: 'Most services give you a clear quote upon request based on your specific home requirements. You only pay after the job is completed to your satisfaction, either via M-Pesa or cash directly to the service provider.'
    },
    {
      q: 'Will I get a receipt or booking summary?',
      a: 'Yes! A complete booking summary is immediately saved to your account dashboard under "My Bookings", and a clean downloadable receipt is generated directly for your records.'
    },
    {
      q: 'How do I track the progress of my booking?',
      a: 'You can view the real-time status of your service request anytime from your account dashboard under "My Bookings", showing when a helper is assigned and en route.'
    },
    {
      q: 'Can I reschedule or cancel a booking if my plans change?',
      a: 'Yes! You can easily update or reschedule your service bookings directly from your account dashboard prior to provider dispatch.'
    },
    {
      q: 'How is security handled at our estate gate?',
      a: 'Your peace of mind comes first. Every helper dispatched carries a valid Kenyan National ID and a verified EstateConnect pass. Estate security guards at the gate check these details before allowing anyone entry into your sector.'
    },
    {
      q: 'Are all neighborhood service specialists background-checked?',
      a: 'Yes! Every provider listed on EstateConnect undergoes strict identity verification, background checks, and gate clearance before serving estate households.'
    },
    {
      q: 'How quickly can a service provider arrive at my home?',
      a: 'For urgent requests like water delivery, cooking gas refills, or emergency plumbing fixes, assigned local specialists can reach your doorstep in as little as 30 to 60 minutes.'
    },
    {
      q: 'What if I need a custom job done around the house?',
      a: 'Just use the "Request Custom Service" button on your dashboard. Tell us what you need done and when, and our team will match you with a skilled local expert to take care of it.'
    },
    {
      q: 'How do local service providers join our platform?',
      a: 'Local professionals in Fedha Estate and Nairobi can register using the provider link on our homepage. We verify their identity and background before approving them to serve estate residents.'
    },
    {
      q: 'Who can I reach out to if I need help?',
      a: 'We are always nearby! Call or WhatsApp our estate support desk directly at 0796502465 anytime.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-100 flex flex-col my-auto animate-fade-in overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold uppercase tracking-tight text-white">
                Neighbor Help &amp; Guide
              </h2>
              <p className="text-xs text-slate-400">
                Friendly answers for Fedha Estate &amp; Nairobi residents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 space-y-4 bg-slate-50/50">
          <div className="bg-teal-50 border border-teal-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-teal-900">
            <Heart className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider block">Welcome to Your Neighborhood Community</span>
              <p className="leading-relaxed">
                Here are quick, simple answers to help you get started with booking domestic services and managing home care effortlessly.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-900 text-teal-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    Q{index + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 font-display leading-snug">
                    {faq.q}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-7 font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Neighbor Support Callout */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-teal-400">
                Need Help with a Custom Request?
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Our estate support desk is always here to assist you with booking or gate passes.
              </p>
            </div>
            <a
              href="tel:0796502465"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Support: 0796502465
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-teal-600" /> 0796502465 (Support Desk)
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer ml-auto uppercase tracking-wider"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
