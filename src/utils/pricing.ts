export type VehicleSizeId = 'compact' | 'sedan' | 'suv';
export type ServiceTierId = 'valet' | 'stage1' | 'multistage' | 'ppf';
export type AddonId = 'glass' | 'interior' | 'wheels';

export interface VehicleSizeOption {
  id: VehicleSizeId;
  label: string;
  subtitle: string;
  examples: string;
  multiplier: number;
}

export interface ServiceTierOption {
  id: ServiceTierId;
  name: string;
  shortName: string;
  basePrice: number;
  duration: string;
  warranty: string;
  description: string;
  badge?: string;
}

export interface AddonOption {
  id: AddonId;
  name: string;
  price: number;
  description: string;
  durationNote: string;
}

export interface QuoteInput {
  vehicleSize: VehicleSizeId;
  serviceTier: ServiceTierId;
  addons: AddonId[];
}

export interface QuoteCalculationResult {
  vehicleOption: VehicleSizeOption;
  serviceOption: ServiceTierOption;
  selectedAddons: AddonOption[];
  scaledServicePrice: number;
  addonsTotal: number;
  totalPrice: number;
  estimatedDuration: string;
  depositAmount: number;
}

export type TimeWindowOption = 'Morning Drop-off (08:30 AM)' | 'Afternoon Drop-off (01:30 PM)';

export const TIME_WINDOWS: TimeWindowOption[] = [
  'Morning Drop-off (08:30 AM)',
  'Afternoon Drop-off (01:30 PM)',
];

export interface LeadFormInput {
  name: string;
  phone: string;
  carModel: string;
  dropOffDate: string;
  timeWindow: TimeWindowOption;
}

export interface LeadValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    phone?: string;
    carModel?: string;
    dropOffDate?: string;
  };
}

export const VEHICLE_SIZES: VehicleSizeOption[] = [
  {
    id: 'compact',
    label: 'Compact / Hatch',
    subtitle: '2-Door Coupe or Hatchback',
    examples: 'VW Golf R, Porsche 911, Mini JCW, Audi RS3',
    multiplier: 1.0,
  },
  {
    id: 'sedan',
    label: 'Sedan / Saloon',
    subtitle: '4-Door Saloon or Estate',
    examples: 'BMW M3, Audi RS6 Avant, Mercedes C63, Taycan',
    multiplier: 1.2,
  },
  {
    id: 'suv',
    label: 'Large SUV / 4x4',
    subtitle: 'Luxury SUV or 7-Seater',
    examples: 'Range Rover Sport, BMW X5 M, Porsche Cayenne, Defender',
    multiplier: 1.4,
  },
];

export const SERVICE_TIERS: ServiceTierOption[] = [
  {
    id: 'valet',
    name: 'Full Valet & Decontamination',
    shortName: 'Full Valet & Decon',
    basePrice: 140,
    duration: '~4-5 Hours Studio Time',
    warranty: 'Safe Wash Protection',
    description: 'Deep snow-foam wash, iron & tar fallout removal, clay bar treatment, dry-steam cabin sanitisation, and Nappa leather conditioning.',
  },
  {
    id: 'stage1',
    name: 'Stage 1 Polish + 1-Year Ceramic Sealant',
    shortName: 'Stage 1 + 1Yr Ceramic',
    basePrice: 350,
    duration: '~1-2 Days Studio Time',
    warranty: '1-Year Hydrophobic Warranty',
    description: 'Single-stage machine gloss enhancement removing up to 65% of light wash marring, sealed with Gyeon CanCoat Pro SiO2 protection.',
  },
  {
    id: 'multistage',
    name: 'Multi-Stage Paint Correction + 3-Year Ceramic Coating',
    shortName: 'Multi-Stage + 3Yr 9H Ceramic',
    basePrice: 650,
    duration: '~2-3 Days Studio Time',
    warranty: '3-Year Certified Warranty',
    description: 'Heavy cutting and jewelling polish removing 90%+ of swirl marks and defects, locked in with 9H Gyeon/Kamikaze ceramic glass matrix.',
    badge: 'Most Popular',
  },
  {
    id: 'ppf',
    name: 'Track Pack PPF (Bumper, Bonnet, Mirrors)',
    shortName: 'Track Pack Self-Healing PPF',
    basePrice: 1100,
    duration: '~3-4 Days Studio Time',
    warranty: '10-Year Anti-Yellowing Warranty',
    description: '200-micron optically clear self-healing polyurethane film applied to high-impact front zones to stop stone chips and road rash.',
  },
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: 'glass',
    name: 'Full Glass Hydrophobic Coating',
    price: 80,
    description: 'Rain-repellent fluoropolymer coating across windscreen, side, and rear glass for wiperless clarity at motorway speeds.',
    durationNote: '+1 hr curing',
  },
  {
    id: 'interior',
    name: 'Leather & Fabric Interior Protection',
    price: 120,
    description: 'Matte ceramic shield on leather bolsters and Alcantara surfaces to prevent dye transfer, UV fading, and coffee spills.',
    durationNote: '+2 hrs curing',
  },
  {
    id: 'wheels',
    name: 'Wheel Off Ceramic Coating',
    price: 160,
    description: 'All four wheels removed on hydraulic lift; inner barrels and brake calipers deep-cleaned and coated against high-temp brake dust.',
    durationNote: '+3 hrs studio time',
  },
];

export function calculateQuote(input: QuoteInput): QuoteCalculationResult {
  const vehicleOption =
    VEHICLE_SIZES.find((v) => v.id === input.vehicleSize) ?? VEHICLE_SIZES[0];
  const serviceOption =
    SERVICE_TIERS.find((s) => s.id === input.serviceTier) ?? SERVICE_TIERS[2];

  const uniqueAddonIds = Array.from(new Set(input.addons));
  const selectedAddons = ADDON_OPTIONS.filter((a) =>
    uniqueAddonIds.includes(a.id)
  );

  const scaledServicePrice = Math.round(
    serviceOption.basePrice * vehicleOption.multiplier
  );
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = scaledServicePrice + addonsTotal;

  let estimatedDuration = serviceOption.duration;
  if (input.serviceTier === 'valet' && selectedAddons.some((a) => a.id === 'wheels')) {
    estimatedDuration = '~6-8 Hours Studio Time';
  }

  return {
    vehicleOption,
    serviceOption,
    selectedAddons,
    scaledServicePrice,
    addonsTotal,
    totalPrice,
    estimatedDuration,
    depositAmount: 0,
  };
}

export function validateLeadForm(input: LeadFormInput): LeadValidationResult {
  const errors: LeadValidationResult['errors'] = {};
  const trimmedName = input.name.trim();
  const trimmedPhone = input.phone.trim();
  const trimmedCar = input.carModel.trim();
  const trimmedDate = input.dropOffDate.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your full name.';
  }

  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    errors.phone = 'Please enter a valid Irish or international phone / WhatsApp number.';
  }

  if (trimmedCar.length < 2) {
    errors.carModel = 'Please enter your car make & reg / model (e.g. 241-D-911 Porsche 911).';
  }

  if (!trimmedDate) {
    errors.dropOffDate = 'Please select a preferred studio drop-off date.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateBookingId(name: string, totalPrice: number): string {
  const seed = name
    .trim()
    .split('')
    .reduce((acc, ch, idx) => acc + ch.charCodeAt(0) * (idx + 17), 0);
  const fourDigit = 1000 + ((seed + totalPrice * 7) % 9000);
  return `#APX-${fourDigit}`;
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export const formatEuro = formatCurrency;
