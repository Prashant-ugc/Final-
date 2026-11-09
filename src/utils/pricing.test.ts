import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuote,
  validateLeadForm,
  generateBookingId,
  formatEuro,
} from './pricing';

test('calculateQuote computes exact base prices for Compact (1.0x) with no addons', () => {
  const valet = calculateQuote({
    vehicleSize: 'compact',
    serviceTier: 'valet',
    addons: [],
  });
  assert.equal(valet.scaledServicePrice, 140);
  assert.equal(valet.totalPrice, 140);
  assert.equal(valet.estimatedDuration, '~4-5 Hours Studio Time');

  const ceramic = calculateQuote({
    vehicleSize: 'compact',
    serviceTier: 'multistage',
    addons: [],
  });
  assert.equal(ceramic.scaledServicePrice, 650);
  assert.equal(ceramic.totalPrice, 650);
  assert.equal(ceramic.estimatedDuration, '~2-3 Days Studio Time');
});

test('calculateQuote applies 1.2x multiplier for Sedan and 1.4x for Large SUV', () => {
  const sedanStage1 = calculateQuote({
    vehicleSize: 'sedan',
    serviceTier: 'stage1',
    addons: [],
  });
  // 350 * 1.2 = 420
  assert.equal(sedanStage1.scaledServicePrice, 420);
  assert.equal(sedanStage1.totalPrice, 420);

  const suvPpf = calculateQuote({
    vehicleSize: 'suv',
    serviceTier: 'ppf',
    addons: [],
  });
  // 1100 * 1.4 = 1540
  assert.equal(suvPpf.scaledServicePrice, 1540);
  assert.equal(suvPpf.totalPrice, 1540);
});

test('calculateQuote adds selected add-ons flat fee to scaled base price', () => {
  const fullBuild = calculateQuote({
    vehicleSize: 'suv',
    serviceTier: 'multistage',
    addons: ['glass', 'interior', 'wheels'],
  });
  // 650 * 1.4 = 910; addons = 80 + 120 + 160 = 360; total = 1270
  assert.equal(fullBuild.scaledServicePrice, 910);
  assert.equal(fullBuild.addonsTotal, 360);
  assert.equal(fullBuild.totalPrice, 1270);
  assert.equal(formatEuro(fullBuild.totalPrice), '$1,270');
});

test('validateLeadForm validates Step 4 Book On The Spot fields and generateBookingId formats #APX-XXXX', () => {
  const invalid = validateLeadForm({
    name: '',
    phone: '123',
    carModel: '',
    dropOffDate: '',
    timeWindow: 'Morning Drop-off (08:30 AM)',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.carModel);
  assert.ok(invalid.errors.dropOffDate);

  const valid = validateLeadForm({
    name: "Cian O'Brien",
    phone: '+353 87 901 2345',
    carModel: '241-D-4821 · BMW M3 Competition',
    dropOffDate: '2026-11-12',
    timeWindow: 'Afternoon Drop-off (01:30 PM)',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});

  const bookingId = generateBookingId("Cian O'Brien", 1270);
  assert.match(bookingId, /^#APX-\d{4}$/);
});
