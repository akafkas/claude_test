import test from 'node:test';
import assert from 'node:assert/strict';

import { createPayloadConfig } from '../apps/cms/dist/payload.config.js';

const findCollection = (config, slug) => config.collections.find((collection) => collection.slug === slug);
const fieldNames = (collection) => collection.fields.map((field) => field.name);

const propertyAdminReq = {
  user: {
    id: 'u2',
    isSuperAdmin: false,
    memberships: [
      {
        organizationId: 'org_1',
        role: 'property_admin',
        propertyIds: ['prop_1', 'prop_2'],
        status: 'active'
      }
    ]
  }
};

test('step g: payload config includes inventory and pricing collections', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const slugs = config.collections.map((collection) => collection.slug);

  assert.ok(slugs.includes('roomTypes'));
  assert.ok(slugs.includes('roomUnits'));
  assert.ok(slugs.includes('ratePlans'));
  assert.ok(slugs.includes('seasonRules'));
  assert.ok(slugs.includes('availability'));
  assert.ok(slugs.includes('taxRules'));
  assert.ok(slugs.includes('promoCodes'));
  assert.ok(slugs.includes('addOns'));
});

test('step g: inventory and pricing collections expose required minimum field sets', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  assert.deepEqual(fieldNames(findCollection(config, 'roomTypes')), [
    'property',
    'name',
    'slug',
    'description',
    'maxOccupancy',
    'maxAdults',
    'maxChildren',
    'amenities',
    'images',
    'active'
  ]);

  assert.deepEqual(fieldNames(findCollection(config, 'roomUnits')), ['property', 'roomType', 'code', 'active']);

  assert.deepEqual(fieldNames(findCollection(config, 'ratePlans')), [
    'property',
    'roomType',
    'name',
    'code',
    'cancellationPolicy',
    'paymentPolicy',
    'minStayDefault',
    'maxStayDefault',
    'active'
  ]);

  assert.deepEqual(fieldNames(findCollection(config, 'seasonRules')), [
    'property',
    'ratePlan',
    'startDate',
    'endDate',
    'basePrice',
    'weekendPrice',
    'extraAdultPrice',
    'extraChildPrice',
    'minStay',
    'maxStay',
    'closedToArrival',
    'closedToDeparture',
    'stopSell'
  ]);

  assert.deepEqual(fieldNames(findCollection(config, 'availability')), [
    'property',
    'roomType',
    'date',
    'totalUnits',
    'bookedUnits',
    'heldUnits',
    'availableUnits',
    'stopSell',
    'closedToArrival',
    'closedToDeparture',
    'minStay',
    'maxStay',
    'overridePrice'
  ]);

  assert.deepEqual(fieldNames(findCollection(config, 'taxRules')), ['property', 'name', 'type', 'value', 'active']);

  assert.deepEqual(fieldNames(findCollection(config, 'promoCodes')), [
    'property',
    'code',
    'type',
    'value',
    'validFrom',
    'validTo',
    'maxUses',
    'minStay',
    'minAmount',
    'active'
  ]);

  assert.deepEqual(fieldNames(findCollection(config, 'addOns')), [
    'property',
    'name',
    'code',
    'description',
    'priceType',
    'price',
    'active'
  ]);
});

test('step g: tenant-scoped access is applied to inventory and pricing collections', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const roomTypes = findCollection(config, 'roomTypes');
  const availability = findCollection(config, 'availability');

  assert.deepEqual(roomTypes.access.read({ req: propertyAdminReq }), {
    where: {
      property: {
        in: ['prop_1', 'prop_2']
      }
    }
  });

  assert.deepEqual(availability.access.update({ req: propertyAdminReq }), {
    where: {
      property: {
        in: ['prop_1', 'prop_2']
      }
    }
  });

  assert.equal(roomTypes.access.create({ req: propertyAdminReq }), true);
});
