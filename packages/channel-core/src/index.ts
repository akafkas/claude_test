import type { PropertyRef } from '@nous/types';

export type SupportedChannel = 'booking_com' | 'airbnb' | 'mock';

export interface SyncRequest {
  channel: SupportedChannel;
  scope: PropertyRef;
}
