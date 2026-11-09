import React, { useState } from 'react';
import {
  Check,
  Clock,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  RotateCcw,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';
import {
  VEHICLE_SIZES,
  SERVICE_TIERS,
  ADDON_OPTIONS,
  TIME_WINDOWS,
  VehicleSizeId,
  ServiceTierId,
  AddonId,
  TimeWindowOption,
  calculateQuote,
  validateLeadForm,
  generateBookingId,
  formatEuro,
} from '../utils/pricing';

export interface SubmittedQuoteRecord {
  id: string;
  name: string;
  phone: string;
  carModel: string;
  dropOffDate: string;
  timeWindow: TimeWindowOption;
  vehicleLabel: string;
  serviceName: string;
  addons: string[];
  totalPrice: number;
  estimatedDuration: string;
  submittedAt: string;
}

interface CalculatorSectionProps {
  vehicleSize: VehicleSizeId;
  setVehicleSize: (size: VehicleSizeId) => void;
  serviceTier: ServiceTierId;
  setServiceTier: (tier: ServiceTierId) => void;
  selectedAddons: AddonId[];
  toggleAddon: (addon: AddonId) => void;
  submittedQuotes: SubmittedQuoteRecord[];
  onQuoteSubmit: (record: SubmittedQuoteRecord) => void;
  onMessageWhatsApp: (record: SubmittedQuoteRecord) => void;
}

const UPCOMING_SLOT_DATES = [
  { value: '2026-11-10', label: 'Tue 10 Nov' },
  { value: '2026-11-12', label: 'Thu 12 Nov' },
  { value: '2026-11-14', label: 'Sat 14 Nov' },
];

function VehicleSilhouette({ type, active }: { type: VehicleSizeId; active: boolean }) {
  const strokeColor = active ? '#22D3EE' : '#94A3B8';
  if (type === 'compact') {
    return (
      <svg viewBox="0 0 64 28" className="w-14 h-7 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M8 20L12 11C13.5 8.5 16.5 7 20 7H39C43 7 46 9 48.5 12L55 14.5C56.8 15.2 58 17 58 19V20H8Z"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="20" r="4.5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
        <circle cx="47" cy="20" r="4.5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
      </svg>
    );
  }
  if (type === 'sedan') {
    return (
      <svg viewBox="0 0 64 28" className="w-14 h-7 shrink-0" fill="none" aria-hidden="true">
        <path
          d="M5 20L9 13.5L17 7.5C19 6.3 21.5 6 24 6H38C41 6 43.8 7.2 46 9.5L51 13.5L58 15C59.2 15.4 60 16.6 60 18V20H5Z"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="20" r="4.5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
        <circle cx="49" cy="20" r="4.5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 28" className="w-14 h-7 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M5 20V12C5 9.5 6.8 7.5 9.2 7L14 5.5C16 5 18 4.8 20 4.8H43C45.5 4.8 47.8 6.2 49 8.5L52 13L58 14.2C59.2 14.5 60 15.6 60 17V20H5Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="20" r="5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
      <circle cx="48" cy="20" r="5" fill="#0B0F19" stroke={strokeColor} strokeWidth="2" />
    </svg>
  );
}

export const CalculatorSection: React.FC<CalculatorSectionProps> = ({
  vehicleSize,
  setVehicleSize,
  serviceTier,
  setServiceTier,
  selectedAddons,
  toggleAddon,
  submittedQuotes,
  onQuoteSubmit,
  onMessageWhatsApp,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [dropOffDate, setDropOffDate] = useState('2026-11-10');
  const [timeWindow, setTimeWindow] = useState<TimeWindowOption>('Morning Drop-off (08:30 AM)');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    carModel?: string;
    dropOffDate?: string;
  }>({});
  const [lastSubmitted, setLastSubmitted] = useState<SubmittedQuoteRecord | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);

  const calculation = calculateQuote({
    vehicleSize,
    serviceTier,
    addons: selectedAddons,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadForm({
      name,
      phone,
      carModel,
      dropOffDate,
      timeWindow,
    });
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    const bookingId = generateBookingId(name, calculation.totalPrice);
    const newRecord: SubmittedQuoteRecord = {
      id: bookingId,
      name: name.trim(),
      phone: phone.trim(),
      carModel: carModel.trim(),
      dropOffDate,
      timeWindow,
      vehicleLabel: calculation.vehicleOption.label,
      serviceName: calculation.serviceOption.name,
      addons: calculation.selectedAddons.map((a) => a.name),
      totalPrice: calculation.totalPrice,
      estimatedDuration: calculation.estimatedDuration,
      submittedAt: 'Reserved · Pay Upon Collection',
    };

    setCalendarAdded(false);
    setLastSubmitted(newRecord);
    onQuoteSubmit(newRecord);
  };

  const handleAddToCalendar = () => {
    if (!lastSubmitted) return;
    const rawDate = lastSubmitted.dropOffDate.replace(/-/g, '');
    const startHour = lastSubmitted.timeWindow.includes('08:30') ? '083000' : '133000';
    const endHour = lastSubmitted.timeWindow.includes('08:30') ? '123000' : '173000';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Apex Detailing & Ceramic Studio Dublin//EN',
      'BEGIN:VEVENT',
      `UID:${lastSubmitted.id.replace('#', '')}@apexdetailing.ie`,
      `DTSTART:${rawDate}T${startHour}`,
      `DTEND:${rawDate}T${endHour}`,
      `SUMMARY:Apex Studio Dublin (${lastSubmitted.id}) - ${lastSubmitted.serviceName}`,
      `LOCATION:Unit 14, Sandyford Industrial Estate, Dublin 18, D18 X9K2`,
      `DESCRIPTION:Vehicle: ${lastSubmitted.carModel} (${lastSubmitted.vehicleLabel})\\nEstimated Total: ${formatEuro(lastSubmitted.totalPrice)} (No upfront payment - Pay upon collection)`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    try {
      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Apex-Dublin-Slot-${lastSubmitted.id.replace('#', '')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback handled via state confirmation
    }
    setCalendarAdded(true);
  };

  const handleResetCalculator = () => {
    setVehicleSize('compact');
    setServiceTier('multistage');
    selectedAddons.forEach((a) => toggleAddon(a));
    setLastSubmitted(null);
    setFormErrors({});
  };

  return (
    <section
      id="calculator"
      aria-labelledby="calculator-heading"
      className="py-20 lg:py-28 scroll-mt-20 border-t border-slate-800/80 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-cyan-400 tracking-wide mb-2">
              01. 4-Step Instant Quote & Live Studio Bay Booking
            </p>
            <h2
              id="calculator-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance"
            >
              Configure Your Quote & Book On The Spot
            </h2>
          </div>
          <p className="text-slate-400 max-w-xl text-base leading-relaxed">
            Transparent studio pricing in Dollars ($). Configure your vehicle in Steps 1–3 and
            reserve your drop-off slot in Step 4 with zero upfront payment required today.
          </p>
        </div>

        {/* Main 12-Column Split: 7 Columns Steps 1-3 | 5 Columns Step 4 Live Reservation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Steps 1, 2, 3 */}
          <div className="lg:col-span-7 space-y-10 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8">
            {/* Step 1: Vehicle Size */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Step 1: Select Vehicle Size
                </h3>
                <span className="text-xs text-slate-400 font-mono-num">
                  Multiplier: {calculation.vehicleOption.multiplier.toFixed(1)}x
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Select Vehicle Size"
                className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
              >
                {VEHICLE_SIZES.map((size) => {
                  const isSelected = vehicleSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setVehicleSize(size.id)}
                      className={`group text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[132px] ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <VehicleSilhouette type={size.id} active={isSelected} />
                        <span
                          className={`text-xs font-mono-num font-semibold px-2 py-0.5 rounded ${
                            isSelected
                              ? 'text-cyan-300 bg-cyan-500/20'
                              : 'text-slate-400 bg-slate-900'
                          }`}
                        >
                          {size.multiplier.toFixed(1)}x
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-base text-white mb-0.5">
                          {size.label}
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1">
                          {size.examples}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Step 2: Choose Service Tier */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Step 2: Choose Service Tier
                </h3>
                <span className="text-xs text-slate-400">
                  Prices auto-scale to vehicle size
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Choose Service Tier"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
              >
                {SERVICE_TIERS.map((tier) => {
                  const isSelected = serviceTier === tier.id;
                  const scaledPrice = Math.round(
                    tier.basePrice * calculation.vehicleOption.multiplier
                  );
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setServiceTier(tier.id)}
                      className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-400 text-white'
                          : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-semibold text-sm sm:text-base text-white leading-snug">
                            {tier.name}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                                : 'border-slate-700 bg-slate-900'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {tier.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800/70 flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Base: ${tier.basePrice.toLocaleString('en-US')} · {tier.duration}
                        </span>
                        <span className="font-mono-num font-semibold text-sm text-emerald-400">
                          {formatEuro(scaledPrice)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Step 3: Add-on Checkboxes */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Step 3: Add-on Checkboxes (Optional)
                </h3>
                <span className="text-xs text-slate-400 font-mono-num">
                  {selectedAddons.length} selected
                </span>
              </div>

              <div className="space-y-3">
                {ADDON_OPTIONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                        isChecked
                          ? 'bg-emerald-500/10 border-emerald-400/80 text-white'
                          : 'bg-slate-950/60 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAddon(addon.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors ${
                            isChecked
                              ? 'bg-emerald-400 border-emerald-400 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm sm:text-base text-white">
                            {addon.name}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {addon.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono-num font-semibold text-sm text-emerald-400">
                          +${addon.price}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {addon.durationNote}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Step 4 LIVE "BOOK ON THE SPOT" RESERVATION */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-cyan-400 tracking-wide">
                  Step 4: Live “Book On The Spot” Reservation
                </span>
                <button
                  type="button"
                  onClick={handleResetCalculator}
                  title="Reset calculator to default"
                  className="p-1.5 text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Dynamic Total Banner */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div
                    data-testid="live-estimated-price"
                    className="text-2xl sm:text-3xl font-bold text-white font-mono-num tracking-tight"
                  >
                    Estimated Total: {formatEuro(calculation.totalPrice)}
                  </div>
                  <span className="text-xs text-emerald-400 font-medium">
                    $0 Due Today · Inc. Tax
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <strong data-testid="live-estimated-duration" className="text-white">
                      {calculation.estimatedDuration}
                    </strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{calculation.serviceOption.warranty}</span>
                  </span>
                </div>

                {/* Live Line-Item Summary */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>
                      {calculation.serviceOption.shortName} ({calculation.vehicleOption.label}{' '}
                      {calculation.vehicleOption.multiplier.toFixed(1)}x)
                    </span>
                    <span className="font-mono-num text-white">
                      {formatEuro(calculation.scaledServicePrice)}
                    </span>
                  </div>
                  {calculation.selectedAddons.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-slate-400">
                      <span>+ {addon.name}</span>
                      <span className="font-mono-num text-emerald-400">+${addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Confirmation Screen OR Step 4 Reservation Form */}
              {lastSubmitted ? (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="quote-confirmation-box"
                  className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-lg font-bold text-white">Slot Reserved!</h4>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          Your Sandyford cleanroom bay is reserved for{' '}
                          <span className="text-white font-medium">{lastSubmitted.name}</span>. No
                          upfront payment required—pay at studio upon collection.
                        </p>
                      </div>
                    </div>
                    <span
                      data-testid="booking-id-badge"
                      className="font-mono-num text-sm font-bold text-cyan-300 bg-slate-950 border border-cyan-500/40 px-2.5 py-1 rounded-lg shrink-0"
                    >
                      {lastSubmitted.id}
                    </span>
                  </div>

                  <div className="bg-slate-950/90 rounded-lg p-3.5 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-400">Booking ID:</span>
                      <span className="font-mono-num font-semibold text-cyan-400">
                        {lastSubmitted.id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-400">Vehicle & Reg:</span>
                      <span className="text-white font-medium text-right">
                        {lastSubmitted.carModel} ({lastSubmitted.vehicleLabel})
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-400">Selected Package:</span>
                      <span className="text-white font-medium text-right">
                        {lastSubmitted.serviceName}
                      </span>
                    </div>
                    {lastSubmitted.addons.length > 0 && (
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">Add-Ons:</span>
                        <span className="text-emerald-300 text-right">
                          {lastSubmitted.addons.join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-400">Drop-Off Slot:</span>
                      <span className="text-cyan-300 font-medium text-right">
                        {lastSubmitted.dropOffDate} · {lastSubmitted.timeWindow}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 pt-1.5 border-t border-slate-800">
                      <span className="text-slate-400">Locked Total (Pay on Collection):</span>
                      <span className="font-mono-num font-bold text-emerald-400">
                        {formatEuro(lastSubmitted.totalPrice)} ({lastSubmitted.estimatedDuration})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={handleAddToCalendar}
                      className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <CalendarCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{calendarAdded ? 'Added to Calendar (.ics)' : 'Add to Calendar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onMessageWhatsApp(lastSubmitted)}
                      className="py-2.5 px-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span>Message on WhatsApp</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setLastSubmitted(null)}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Modify Reservation Details or Book Another Vehicle
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Drop-Off Date Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="quote-date"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Drop-Off Date Picker
                      </label>
                      <div className="flex items-center gap-1">
                        {UPCOMING_SLOT_DATES.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => {
                              setDropOffDate(slot.value);
                              if (formErrors.dropOffDate)
                                setFormErrors({ ...formErrors, dropOffDate: undefined });
                            }}
                            className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                              dropOffDate === slot.value
                                ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/50'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {slot.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        id="quote-date"
                        type="date"
                        min="2026-11-09"
                        value={dropOffDate}
                        onChange={(e) => {
                          setDropOffDate(e.target.value);
                          if (formErrors.dropOffDate)
                            setFormErrors({ ...formErrors, dropOffDate: undefined });
                        }}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                    {formErrors.dropOffDate && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.dropOffDate}</span>
                      </p>
                    )}
                  </div>

                  {/* Time Window Selection (2 selectable buttons) */}
                  <div>
                    <span className="block text-xs font-medium text-slate-300 mb-1.5">
                      Time Window Selection
                    </span>
                    <div
                      role="radiogroup"
                      aria-label="Time Window Selection"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                    >
                      {TIME_WINDOWS.map((windowLabel) => {
                        const isSelected = timeWindow === windowLabel;
                        return (
                          <button
                            key={windowLabel}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => setTimeWindow(windowLabel)}
                            className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                              isSelected
                                ? 'bg-cyan-500/15 border-cyan-400 text-cyan-200 font-semibold'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                            <span>{windowLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Quick Fields */}
                  <div>
                    <label
                      htmlFor="quote-name"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="quote-name"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      placeholder="e.g. Cian O'Brien"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="quote-phone"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="quote-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                      }}
                      placeholder="e.g. +353 87 412 9081"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.phone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="quote-car"
                      className="block text-xs font-medium text-slate-300 mb-1.5"
                    >
                      Car Make & Reg / Model
                    </label>
                    <input
                      id="quote-car"
                      type="text"
                      value={carModel}
                      onChange={(e) => {
                        setCarModel(e.target.value);
                        if (formErrors.carModel)
                          setFormErrors({ ...formErrors, carModel: undefined });
                      }}
                      placeholder="e.g. 241-D-911 · Porsche 911 GT3"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    {formErrors.carModel && (
                      <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{formErrors.carModel}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Lock In Quote & Book My Slot On The Spot</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    No upfront payment required — Pay at studio upon collection · Sandyford D18
                  </p>
                </form>
              )}

              {/* Live Studio Queue Activity */}
              {submittedQuotes.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <div className="text-xs font-medium text-slate-400 mb-2.5 flex items-center justify-between">
                    <span>Reserved Studio Bay Slots (This Session)</span>
                    <span className="font-mono-num text-cyan-400">
                      {submittedQuotes.length} booked
                    </span>
                  </div>
                  <div className="space-y-2">
                    {submittedQuotes.slice(0, 2).map((q) => (
                      <div
                        key={q.id}
                        className="text-xs bg-slate-950/70 border border-slate-800/90 rounded-lg px-3 py-2 flex items-center justify-between"
                      >
                        <div className="truncate pr-2">
                          <span className="text-cyan-400 font-mono-num font-semibold">{q.id}</span>
                          <span className="text-slate-500 mx-1.5">·</span>
                          <span className="text-white font-medium">{q.carModel}</span>
                          <span className="text-slate-500 mx-1.5">·</span>
                          <span className="text-slate-400">{q.dropOffDate}</span>
                        </div>
                        <span className="font-mono-num text-emerald-400 font-semibold shrink-0">
                          {formatEuro(q.totalPrice)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
