import React from 'react';
import { MessageCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG, getGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';

export const WhatsAppCtaBanner: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 bg-[#651F32] text-white relative overflow-hidden">
      {/* Subtle gold decorative line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-medium text-[#DEC596] border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Direct Boutique Artisan Service</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight">
            Have a Specific Color or Chunri Design in Mind?
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto font-normal leading-relaxed">
            Message Yasir Farooq directly on WhatsApp for custom inquiries, fabric details, color matching, and order assistance.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getGeneralInquiryWhatsAppUrl(`Assalam o Alaikum Yasir Bhai, I would like to inquire about Fairytale Chunri Closet custom pieces.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FAF7F2] text-[#651F32] px-8 py-3.5 rounded-md font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-[#651F32]" />
              <span>Chat on WhatsApp (+92 303 6466711)</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#DEC596]" />
              <span>Prompt WhatsApp Responses</span>
            </div>
            <span className="text-[#DEC596]">·</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DEC596]" />
              <span>Direct From Bahawalpur Workshop</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
