import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  X,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  VehicleSizeId,
  ServiceTierId,
  AddonId,
  calculateQuote,
  formatEuro,
} from './utils/pricing';
import {
  CalculatorSection,
  SubmittedQuoteRecord,
} from './components/CalculatorSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { PackagesSection } from './components/PackagesSection';
import { ReviewsAndFaq } from './components/ReviewsAndFaq';
import heroStudioImg from './assets/images/hero_supercar_studio_1794151980734.jpg';

const HERO_IMAGE = heroStudioImg;

export default function App() {
  const [vehicleSize, setVehicleSize] = useState<VehicleSizeId>('compact');
  const [serviceTier, setServiceTier] = useState<ServiceTierId>('multistage');
  const [selectedAddons, setSelectedAddons] = useState<AddonId[]>([]);
  const [submittedQuotes, setSubmittedQuotes] = useState<SubmittedQuoteRecord[]>([]);

  // WhatsApp Studio Drawer state
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [waMessage, setWaMessage] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [waSent, setWaSent] = useState(false);

  const toggleAddon = (addon: AddonId) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((item) => item !== addon) : [...prev, addon]
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPackage = (tierId: ServiceTierId) => {
    setServiceTier(tierId);
    scrollToSection('calculator');
  };

  const currentEstimate = calculateQuote({
    vehicleSize,
    serviceTier,
    addons: selectedAddons,
  });

  const handleOpenWhatsAppModal = (booking?: SubmittedQuoteRecord) => {
    if (booking) {
      setWaPhone(booking.phone);
      setWaMessage(
        `Hi Apex Studio Dublin! I just reserved slot ${booking.id} for my ${booking.carModel} (${booking.serviceName}) on ${booking.dropOffDate} — ${booking.timeWindow}. Estimated Total: ${formatEuro(booking.totalPrice)}.`
      );
    } else {
      setWaMessage(
        `Hi Apex Studio Dublin, I configured an online estimate (${formatEuro(
          currentEstimate.totalPrice
        )} for ${currentEstimate.serviceOption.shortName} · ${
          currentEstimate.vehicleOption.label
        }). Can I confirm a drop-off slot this week?`
      );
    }
    setWaSent(false);
    setWhatsappModalOpen(true);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waMessage.trim()) return;
    setWaSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col pb-16 md:pb-0">
      {/* 1. STICKY GLASSMORPHIC NAVBAR (Strict 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 md:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight text-white font-display whitespace-nowrap shrink-0"
          >
            Apex Detailing & Ceramic Studio
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300"
          >
            <a
              href="#calculator"
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Calculator
            </a>
            <a
              href="#before-after"
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Before & After
            </a>
            <a
              href="#packages"
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Packages
            </a>
            <a
              href="#reviews"
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              Reviews
            </a>
            <a
              href="#faq"
              className="hover:text-cyan-300 transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection('calculator')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Book Instant Slot
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* 1B. HERO SECTION */}
        <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
              {/* Left Column: Editorial Value Proposition */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs sm:text-sm font-medium text-cyan-400 tracking-wide mb-4">
                  Dublin’s 5-Star Paint Protection Specialists · Sandyford D18 Cleanroom
                </p>

                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight leading-[1.08] text-balance mb-6">
                  Factory Finish, Protected For Life.
                </h1>

                <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
                  Precision <span className="text-white font-medium">Multi-Stage Machine Polishing</span>,
                  infrared-cured <span className="text-white font-medium">9H Ceramic Coatings</span>, and
                  optically invisible <span className="text-white font-medium">Self-Healing PPF</span> engineered
                  for Ireland’s harshest coastal and motorway conditions.
                </p>

                {/* Primary & Secondary Hero CTAs */}
                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <button
                    type="button"
                    onClick={() => scrollToSection('calculator')}
                    className="px-6 py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm sm:text-base rounded-xl transition-all duration-150 flex items-center gap-2.5 shadow-lg shadow-cyan-500/20 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Calculator className="w-4 h-4" />
                    <span>Get Instant Quote & Book</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollToSection('before-after')}
                    className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm sm:text-base rounded-xl transition-all duration-150 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>View Recent Work</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>

                {/* Social Proof Bar */}
                <div className="pt-6 border-t border-slate-800/90 flex flex-wrap items-center gap-y-2 gap-x-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center gap-1 text-emerald-400" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <span className="font-medium text-white">
                    Over 650+ Supercars & Daily Drivers Protected across Ireland
                  </span>
                  <span aria-hidden="true" className="text-slate-600">
                    •
                  </span>
                  <span className="text-cyan-300 font-mono-num font-semibold">
                    5.0 Google Rating
                  </span>
                </div>
              </div>

              {/* Right Column: Dominant 16:9 Studio Visual Anchor */}
              <div className="lg:col-span-6 flex">
                <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl flex flex-col justify-end min-h-[320px] sm:min-h-[420px] lg:h-full">
                  <img
                    src={HERO_IMAGE}
                    alt="Obsidian black Porsche 911 GT3 inside Apex Detailing & Ceramic Studio in Dublin under overhead LED inspection lights"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                  <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-cyan-300 font-medium mb-1">
                        Featured Bay Completion · Sandyford Studio D18
                      </p>
                      <p className="text-base sm:text-lg font-bold text-white">
                        Porsche 911 (992) GT3 — 2-Stage Correction & 9H Ceramic
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs text-slate-400 block">Live Slot Booking</span>
                      <span className="text-sm font-mono-num font-semibold text-emerald-400">
                        $0 Upfront · Pay on Collection
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. INTERACTIVE ESTIMATE & LIVE "BOOK ON THE SPOT" WIDGET */}
        <CalculatorSection
          vehicleSize={vehicleSize}
          setVehicleSize={setVehicleSize}
          serviceTier={serviceTier}
          setServiceTier={setServiceTier}
          selectedAddons={selectedAddons}
          toggleAddon={toggleAddon}
          submittedQuotes={submittedQuotes}
          onQuoteSubmit={(record) => setSubmittedQuotes((prev) => [record, ...prev])}
          onMessageWhatsApp={(record) => handleOpenWhatsAppModal(record)}
        />

        {/* 3. INTERACTIVE BEFORE & AFTER SLIDER */}
        <BeforeAfterSlider />

        {/* 4. SERVICE PACKAGES (CLEAR 3-CARD GRID) */}
        <PackagesSection onSelectPackage={handleSelectPackage} />

        {/* 5 & 6. PROOF & REVIEWS + FAQ ACCORDION */}
        <ReviewsAndFaq />
      </main>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800/90 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
            {/* Brand & Accreditation */}
            <div className="space-y-3">
              <div className="text-lg font-bold text-white font-display">
                Apex Detailing & Ceramic Studio
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dublin’s Gyeon, Kamikaze Collection & XPEL Paint Protection Film studio. Fully
                insured, temperature-controlled, 24/7 CCTV monitored supercar facility.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenWhatsAppModal()}
                  className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Studio on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Dublin Studio Address */}
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Dublin Studio Address</span>
              </div>
              <p className="text-slate-300 font-medium">Unit 14, Apex Cleanroom Facility</p>
              <p>Sandyford Industrial Estate, Burton Hall Rd</p>
              <p>Dublin 18, D18 X9K2, Ireland</p>
              <p className="text-cyan-400 pt-1">2 mins from M50 Junction 14 (Luas Green Line)</p>
            </div>

            {/* Studio Business Hours */}
            <div className="space-y-2 text-xs text-slate-400">
              <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Studio Opening Hours</span>
              </div>
              <div className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="font-mono-num text-slate-200">08:00 – 18:30</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday (Inspections & Drop-off):</span>
                <span className="font-mono-num text-slate-200">09:00 – 16:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Bank Holidays:</span>
                <span className="text-slate-500">By Collector Appointment</span>
              </div>
            </div>

            {/* Direct Studio Contact */}
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Direct Studio Desk</span>
              </div>
              <p className="font-mono-num text-sm text-white font-semibold">
                +353 (01) 539 4820
              </p>
              <p className="font-mono-num text-slate-300">WhatsApp: +353 87 412 9081</p>
              <p>concierge@apexdetailing.ie</p>
              <div className="pt-1 flex items-center gap-3 text-slate-400">
                <a href="#calculator" className="hover:text-cyan-300 transition-colors">
                  Instant Calculator
                </a>
                <span>·</span>
                <a href="#packages" className="hover:text-cyan-300 transition-colors">
                  Packages
                </a>
                <span>·</span>
                <a href="#faq" className="hover:text-cyan-300 transition-colors">
                  Warranty FAQ
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} Apex Detailing & Ceramic Studio Ireland Ltd. Registered in
              Dublin, Ireland (CRO #684921). All prices in Dollars ($).
            </p>
            <p>Gyeon Certified Detailer · XPEL Authorised Dublin Installer</p>
          </div>
        </div>
      </footer>

      {/* 7B. FIXED BOTTOM STICKY BAR FOR MOBILE SCREENS (<= 15% Viewport Height Cap) */}
      <div
        aria-label="Mobile Quick Actions"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center gap-2.5"
      >
        <button
          type="button"
          onClick={() => scrollToSection('calculator')}
          className="flex-1 py-2.5 px-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Calculator className="w-4 h-4 shrink-0" />
          <span>Book Slot On The Spot</span>
        </button>

        <button
          type="button"
          onClick={() => handleOpenWhatsAppModal()}
          className="flex-1 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp Studio</span>
        </button>
      </div>

      {/* Interactive WhatsApp Studio Quick-Dispatch Modal */}
      {whatsappModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <h3 id="whatsapp-modal-title" className="text-base font-bold text-white">
                  WhatsApp Apex Studio Dublin
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close WhatsApp Studio dialog"
                onClick={() => setWhatsappModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {waSent ? (
              <div className="py-4 space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-semibold text-white">
                  WhatsApp Inquiry Dispatched to Studio Desk
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our lead detailer (+353 87 412 9081) has received your message and current{' '}
                  <span className="text-emerald-400 font-mono-num font-semibold">
                    {formatEuro(currentEstimate.totalPrice)}
                  </span>{' '}
                  configuration. Expect a WhatsApp reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setWhatsappModalOpen(false)}
                  className="mt-2 w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Back to Studio Page
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendWhatsApp} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Send your live quote or slot confirmation directly to our Sandyford detailing bay
                  WhatsApp (+353 87 412 9081):
                </p>
                <div>
                  <label
                    htmlFor="wa-phone-input"
                    className="block text-xs font-medium text-slate-300 mb-1"
                  >
                    Your Mobile / WhatsApp Number
                  </label>
                  <input
                    id="wa-phone-input"
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="+353 87 000 0000"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wa-message-input"
                    className="block text-xs font-medium text-slate-300 mb-1"
                  >
                    Message & Pre-Filled Reservation
                  </label>
                  <textarea
                    id="wa-message-input"
                    rows={3}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send WhatsApp Message Now</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
