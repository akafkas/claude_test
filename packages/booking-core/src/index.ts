import type { PropertyRef } from '@nous/types';

export interface AvailabilitySearchInput extends PropertyRef {
  checkIn: string;
  checkOut: string;
}

export const createAvailabilitySearchKey = (input: AvailabilitySearchInput): string => {
  return `${input.organizationId}:${input.propertyId}:${input.checkIn}:${input.checkOut}`;
};
