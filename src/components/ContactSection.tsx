import React, { useState } from 'react';
import { MessageCircle, MapPin, User, Phone, Send } from 'lucide-react';
import { BUSINESS_CONFIG, getWhatsAppUrl, getGeneralInquiryWhatsAppUrl } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

export const ContactSection: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerMessage, setCustomerMessage] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const generateInquiryUrl = () => {
    const formatted = `Assalam o Alaikum, my name is ${customerName || 'a customer'}${
      customerPhone ? ` (Phone: ${customerPhone})` : ''
    }. ${customerMessage || 'I would like to inquire about your clothing catalog.'}`;
    return getWhatsAppUrl(formatted);
  };

  return (
    <section
      id="contact"
      className={`py-14 sm:py-24 border-t transition-colors duration-300 w-full max-w-full overflow-hidden ${
        isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#651F32] dark:text-[#DEC596] font-semibold mb-2">
            Get in Touch
          </p>
          <h2
            className={`font-serif text-3xl sm:text-4xl font-medium tracking-tight ${
              isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
            }`}
          >
            Contact & Location
          </h2>
          <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mt-4 mb-3" />
          <p className={`text-sm sm:text-base ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
            Reach out directly for single piece inquiries, custom sizing, fabric samples, or orders in Bahawalpur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Business Details & Quick Inquiries */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <div
              className={`p-6 sm:p-8 rounded-xl border shadow-sm space-y-6 ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
              }`}
            >
              <div>
                <h3
                  className={`font-serif text-2xl font-medium ${
                    isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                  }`}
                >
                  {BUSINESS_CONFIG.name}
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-[#D8C7B5]' : 'text-[#6B5B53]'}`}>
                  Traditional Clothing & Chunri Specialist
                </p>
              </div>

              <div
                className={`space-y-4 pt-2 border-t ${
                  isDark ? 'border-[#3D2E32]' : 'border-[#F3EDE4]'
                }`}
              >
                {/* Owner */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-md border text-[#651F32] dark:text-[#DEC596] ${
                      isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-70 font-medium block">
                      Business Owner
                    </span>
                    <span className={`text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-[#2B211E]'}`}>
                      {BUSINESS_CONFIG.owner}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-md border text-[#651F32] dark:text-[#DEC596] ${
                      isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-70 font-medium block">
                      Location
                    </span>
                    <span className={`text-sm sm:text-base font-semibold ${isDark ? 'text-white' : 'text-[#2B211E]'}`}>
                      {BUSINESS_CONFIG.location}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-md border text-[#651F32] dark:text-[#DEC596] ${
                      isDark ? 'bg-[#1D1718] border-[#3D2E32]' : 'bg-[#FAF7F2] border-[#EAE2D6]'
                    }`}
                  >
                    <Phone className="w-4 h-4 text-[#651F32] dark:text-[#DEC596]" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider opacity-70 font-medium block">
                      WhatsApp & Mobile
                    </span>
                    <a
                      href={getGeneralInquiryWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-[#651F32] dark:text-[#DEC596] hover:underline tabular-nums"
                    >
                      {BUSINESS_CONFIG.whatsappDisplay}
                    </a>
                  </div>
                </div>

              </div>

              {/* Instant WhatsApp Button */}
              <div className="pt-2">
                <a
                  href={getGeneralInquiryWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#651F32] hover:bg-[#4E1525] text-white py-3.5 px-4 rounded-md font-semibold text-sm transition-all shadow-md cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                  <span>Chat on WhatsApp ({BUSINESS_CONFIG.whatsappDisplay})</span>
                </a>
              </div>
            </div>

            {/* Direct message card */}
            <div
              className={`p-6 rounded-xl border shadow-sm ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
              }`}
            >
              <h4
                className={`font-serif text-lg font-medium mb-3 ${
                  isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                }`}
              >
                Send a Direct WhatsApp Inquiry
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Fatima / Ayesha"
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                      isDark
                        ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                        : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 opacity-80">
                    Your Message / Question
                  </label>
                  <textarea
                    rows={3}
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    placeholder="Ask about chunri availability, custom color-dyeing, or Bahawalpur pickup..."
                    className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-md border focus:outline-hidden ${
                      isDark
                        ? 'bg-[#1D1718] border-[#3D2E32] text-white focus:border-[#C9A96E]'
                        : 'bg-[#FAF7F2] border-[#D8C7B5] text-[#2B211E] focus:border-[#651F32]'
                    }`}
                  />
                </div>
                <a
                  href={generateInquiryUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 border py-2.5 px-4 rounded-md font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#1D1718] hover:bg-[#35282B] text-[#DEC596] border-[#DEC596]/40'
                      : 'bg-[#FAF7F2] hover:bg-[#F3EDE4] text-[#2B211E] border-[#DEC596]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5 text-[#651F32] dark:text-[#DEC596]" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Map Area */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div
              className={`p-4 sm:p-6 rounded-xl border shadow-sm flex-1 flex flex-col ${
                isDark ? 'bg-[#261D1F] border-[#3D2E32]' : 'bg-white border-[#EAE2D6]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4
                    className={`font-serif text-lg font-medium ${
                      isDark ? 'text-[#F7EFE8]' : 'text-[#2B211E]'
                    }`}
                  >
                    Bahawalpur Workshop & Studio Location
                  </h4>
                  <p className="text-xs opacity-70">Punjab, Pakistan</p>
                </div>
                <span className="text-xs text-[#651F32] dark:text-[#DEC596] font-semibold bg-[#651F32]/10 dark:bg-[#DEC596]/10 px-2.5 py-1 rounded">
                  Bahawalpur, PK
                </span>
              </div>

              {/* Embedded Google Maps container centered on Bahawalpur */}
              <div className="relative w-full h-[320px] sm:h-[420px] rounded-lg overflow-hidden border border-[#D8C7B5] dark:border-[#3D2E32] bg-[#F3EDE4]">
                <iframe
                  title="Bahawalpur, Punjab, Pakistan Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110905.77202359489!2d71.61118671842939!3d29.387997577583685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x393b90c42c676d1b%3A0xb3e1ccf772591a32!2sBahawalpur%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1710000000000!5m2!1sen!2s"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <p className="text-xs opacity-70 mt-3">
                * For workshop visits or in-person pickup in Bahawalpur, please reach out in advance on WhatsApp to confirm timing with {BUSINESS_CONFIG.owner}.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
