import React, { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';

interface ClientReview {
  name: string;
  location: string;
  vehicle: string;
  service: string;
  turnaround: string;
  quote: string;
}

const REVIEWS: ClientReview[] = [
  {
    name: "Cormac O'Sullivan",
    location: 'Dalkey, Co. Dublin',
    vehicle: '2023 Porsche 911 (992) GT3 — Jet Black Metallic',
    service: 'Multi-Stage Correction + 5Yr Kamikaze Ceramic + Track Pack PPF',
    turnaround: 'Completed in 3 Days',
    quote:
      'Picked up my 992 GT3 with horrific dealer-installed buffer trails on the bonnet. Apex removed 95% of the defects without compromising clear-coat depth, wrapped the front clip in invisible PPF, and delivered a liquid-mirror finish in 72 hours.',
  },
  {
    name: 'declan.murphy',
    location: 'Blackrock, Cork',
    vehicle: '2024 BMW M3 Competition Touring — Isle of Man Green',
    service: 'Multi-Stage Paint Correction + 3Yr Gyeon 9H Ceramic + Wheel Off Package',
    turnaround: 'Completed in 2 Days',
    quote:
      'Drove up the M8 from Cork specifically for their dust-free studio bay. Even after three weeks of wet Irish motorway commuting, rainwater sheets straight off the windscreen at 80 km/h and M-compound brake dust rinses off the wheels with plain water.',
  },
  {
    name: 'Siobhán Kavanagh',
    location: 'Ballsbridge, Dublin 4',
    vehicle: '2023 Audi RS6 Avant — Sebring Black Crystal',
    service: 'Stage 1 Enhancement + 3Yr Ceramic + Full Nappa Interior Shield',
    turnaround: 'Completed in 48 Hours',
    quote:
      'The online quote calculator matched my final invoice to the dollar. Their team sent WhatsApp paint-gauge photos throughout the two-day booking, and the metallic flake pop under street lights looks deeper than the day it left Ingolstadt.',
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How long does a 9H ceramic coating actually last in Irish weather?',
    answer:
      'Our studio-applied Gyeon Mohs Evo and Kamikaze Miyabi 9H ceramic coatings last a verified 3 to 5 years on daily-driven Irish cars. Unlike spray sealants or dealership "paint protection" waxes that wash off after 6 weeks of road salt and traffic film, a true 9H SiO2 coating bonds covalently with your clear coat and is infrared-cured at 60°C inside our Sandyford studio.',
  },
  {
    question: 'Do I need to pay a deposit online?',
    answer:
      'No upfront payment or online deposit is required. Simply use our 4-step calculator above to lock in your quote and reserve your morning (08:30 AM) or afternoon (01:30 PM) drop-off slot on the spot. You only pay at our Dublin 18 studio upon collection once you have inspected the finished vehicle under our Scangrip daylight lamps.',
  },
  {
    question: 'What is the difference between Car Valeting and Paint Correction Detailing?',
    answer:
      'Valeting focuses on thorough hygienic cleaning and decontamination—safely removing tar, iron brake dust, and interior grime using pH-neutral snow foam and dry steam. Detailing & Paint Correction goes into the microscopic structure of your clear coat using precision dual-action and rotary machine polishers to permanently level swirl marks, scratches, and oxidation before locking in that mirror gloss with ceramic or PPF.',
  },
  {
    question: 'How does the Apex written warranty work?',
    answer:
      'Every 3-Year, 5-Year Ceramic, and 10-Year PPF installation includes a serialized digital warranty certificate tied to your vehicle VIN. We invite you back to our Dublin 18 studio once a year for a complimentary 45-minute decontamination inspection and top-coat maintenance booster to keep your hydrophobic beading performing like day one.',
  },
];

export const ReviewsAndFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      {/* Section 5: Proof & Reviews Section */}
      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className="py-20 lg:py-28 scroll-mt-20 border-t border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-medium text-cyan-400 tracking-wide mb-2">
                04. Verified Owner Testimonials
              </p>
              <h2
                id="reviews-heading"
                className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
              >
                Trusted by Collectors & Daily Drivers Across Dublin & Cork
              </h2>
            </div>
            <div className="text-sm text-slate-300 font-mono-num">
              5.0 / 5.0 Average · 190+ Verified Google Studio Reviews
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {REVIEWS.map((review, idx) => (
              <article
                key={idx}
                className="bg-slate-900/75 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-emerald-400" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{review.turnaround}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1">{review.vehicle}</h3>
                  <p className="text-xs text-cyan-400 mb-4">{review.service}</p>

                  <p className="text-sm text-slate-300 leading-relaxed mb-6">
                    “{review.quote}”
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{review.name}</span>
                  <span className="text-slate-400">{review.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: FAQ Accordion */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="py-20 lg:py-28 scroll-mt-20 border-t border-slate-800/80"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-medium text-cyan-400 tracking-wide mb-2">
              05. Technical Studio FAQ
            </p>
            <h2
              id="faq-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
            >
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/75 border border-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-base hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-cyan-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};
