import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { ServiceTierId } from '../utils/pricing';
import serviceValetInteriorImg from '../assets/images/service_valet_interior_1794151985821.jpg';
import paintAfterCeramicImg from '../assets/images/paint_after_ceramic_1794151984739.jpg';
import servicePpfApplicationImg from '../assets/images/service_ppf_application_1794151986370.jpg';

interface PackagesSectionProps {
  onSelectPackage: (tierId: ServiceTierId) => void;
}

interface PackageCardItem {
  id: ServiceTierId;
  index: string;
  title: string;
  kicker: string;
  priceFrom: string;
  duration: string;
  warranty: string;
  popular?: boolean;
  image: string;
  imageAlt: string;
  features: string[];
  ctaText: string;
}

const PACKAGES: PackageCardItem[] = [
  {
    id: 'valet',
    index: '01',
    title: 'Full Interior & Exterior Valet',
    kicker: 'Deep Decontamination & Cabin Reset',
    priceFrom: '$140',
    duration: '4–6 Hours',
    warranty: 'pH-Neutral Safe Protection',
    image: serviceValetInteriorImg,
    imageAlt: 'Bespoke dry steam and horsehair brush interior detailing on luxury leather seats',
    features: [
      '2-Stage citrus pre-wash, snow foam & 2-bucket grit-guard hand wash',
      'Full chemical iron fallout, tar spot & clay-mitt paintwork decontamination',
      'Dry-steam cabin extraction, air-vent sanitisation & Alcantara cleaning',
      'Matte Nappa leather conditioning feed & deep alloy wheel barrel decon',
    ],
    ctaText: 'Configure Valet Quote',
  },
  {
    id: 'multistage',
    index: '02',
    title: '9H Ceramic Coating',
    kicker: 'Most Popular · Gyeon & Kamikaze Certified',
    priceFrom: '$650',
    duration: '2–3 Days',
    warranty: '3 to 5-Year Written Warranty',
    popular: true,
    image: paintAfterCeramicImg,
    imageAlt: 'Obsidian black car bonnet with 9H ceramic coating and hydrophobic water beading',
    features: [
      'Multi-stage machine polishing removing 90%+ of swirl marks & holograms',
      '9H Gyeon Mohs Evo or Kamikaze Miyabi glass-matrix ceramic application',
      'Infrared short-wave lamp curing in our climate-controlled Dublin cleanroom',
      'Carfax/Service book digital registration & annual inspection warranty',
    ],
    ctaText: 'Configure Ceramic Quote',
  },
  {
    id: 'ppf',
    index: '03',
    title: 'Self-Healing Paint Protection Film',
    kicker: 'Invisible Ballistic Impact Armour',
    priceFrom: '$1,100',
    duration: '3–4 Days',
    warranty: '10-Year Factory Warranty',
    image: servicePpfApplicationImg,
    imageAlt: 'Installer applying optically clear self-healing PPF to a supercar front wing',
    features: [
      '200-micron optically clear XPEL Ultimate Plus / SunTek self-healing film',
      'Stops motorway stone chips, gravel rash, road salt & vandalism scratches',
      'Precision CAD-plotted templates with wrapped edges—zero blade contact on paint',
      'Built-in hydrophobic top-coat that heals light swirl marks with warm water',
    ],
    ctaText: 'Configure PPF Quote',
  },
];

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      className="py-20 lg:py-28 scroll-mt-20 border-t border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-cyan-400 tracking-wide mb-2">
              03. Signature Protection Packages
            </p>
            <h2
              id="packages-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
            >
              Bespoke Treatments Engineered for Irish Roads
            </h2>
          </div>
          <p className="text-slate-400 max-w-xl text-base leading-relaxed">
            Every vehicle enters our Sandyford studio for digital paint thickness mapping before we
            recommend the ideal decontamination, correction, or film architecture.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                pkg.popular
                  ? 'bg-slate-900/95 border-cyan-400/80 shadow-xl shadow-cyan-500/10'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Image Header */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
                  <img
                    src={pkg.image}
                    alt={pkg.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-xs">
                    <span className="text-cyan-300 font-medium">{pkg.kicker}</span>
                    {pkg.popular && (
                      <span className="font-semibold text-emerald-300">Most Popular</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold text-white">
                      {pkg.index}. {pkg.title}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-2 pb-5 mb-5 border-b border-slate-800">
                    <span className="text-xs text-slate-400">From</span>
                    <span className="text-3xl font-bold text-white font-mono-num">
                      {pkg.priceFrom}
                    </span>
                    <span className="text-xs text-slate-400">
                      · {pkg.duration} · {pkg.warranty}
                    </span>
                  </div>

                  <ul className="space-y-3">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-6 sm:p-7 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    pkg.popular
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{pkg.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
