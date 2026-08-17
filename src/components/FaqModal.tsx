import React from 'react';
import { X, HelpCircle, Phone, Heart, Briefcase } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProviderApply?: () => void;
}

export default function FaqModal({ isOpen, onClose, onOpenProviderApply }: FaqModalProps) {
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
      <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl border border-slate-300 flex flex-col my-auto animate-fade-in overflow-hidden">
        
        {/* Modal Header - Maseno Portal Navy & Gold */}
        <div className="p-4 sm:p-5 bg-[#0B2545] text-white flex items-center justify-between shrink-0 border-b-4 border-[#E5A823]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border-2 border-[#E5A823] flex items-center justify-center text-amber-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-400 font-mono">
                Portal Student &amp; Resident Information Directory
              </h2>
              <p className="text-[10px] text-slate-300 font-medium">
                Official Help &amp; Requisition Guidelines for EstateConnect Residents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-8 space-y-4 bg-slate-50/50">
          <div className="bg-amber-50 border border-amber-200/80 rounded-lg p-3.5 flex items-start gap-3 text-xs text-amber-950">
            <Heart className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider block text-[11px] text-amber-900">Official Portal Information Bulletin</span>
              <p className="leading-relaxed">
                Review key portal operational procedures below for managing doorstep service requisitions and household passes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-slate-300 shadow-xs space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-[#0B2545] text-amber-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    Q{index + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wide leading-snug">
                    {faq.q}
                  </h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-7 font-medium">
                  {faq.a}
                </p>
                {index === 10 && onOpenProviderApply && (
                  <div className="pl-7 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenProviderApply();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0B2545] hover:bg-[#071b33] text-amber-300 font-bold text-[11px] rounded transition-all cursor-pointer border-b-2 border-amber-500 uppercase tracking-wider font-mono shadow-xs"
                    >
                      <Briefcase className="h-3.5 w-3.5" />
                      Apply as a Professional Specialist Now
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Neighbor Support Callout */}
          <div className="bg-[#0B2545] rounded-lg p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-[#E5A823]">
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 font-mono">
                Portal Requisition Desk Assistance
              </h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Our estate portal administration is available 24/7 for custom requisitions and gate clearances.
              </p>
            </div>
            <a
              href="tel:0796502465"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-all shadow-sm shrink-0 cursor-pointer uppercase tracking-wider font-mono"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Requisition Desk: 0796502465
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs font-mono font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5 text-[#0B2545]" /> Support Desk: 0796502465
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B2545] hover:bg-[#061830] text-amber-300 text-xs font-bold rounded transition-all cursor-pointer ml-auto uppercase tracking-wider border-b-2 border-amber-500 font-mono"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
}
