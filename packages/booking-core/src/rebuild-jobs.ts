import type { AvailabilityRebuildJob, AvailabilityRebuildScheduler } from './types.js';

export const createInMemoryRebuildScheduler = (): AvailabilityRebuildScheduler & {
  getScheduledJobs(): AvailabilityRebuildJob[];
} => {
  const queue: AvailabilityRebuildJob[] = [];

  return {
    async scheduleRebuild(job) {
      queue.push(job);
    },
    getScheduledJobs() {
      return [...queue];
    }
  };
};

export const buildRebuildJobsForRoomTypes = (input: {
  organizationId: string;
  propertyId: string;
  roomTypeIds: string[];
  startDate: string;
  endDate: string;
  reason: AvailabilityRebuildJob['reason'];
}): AvailabilityRebuildJob[] => {
  return input.roomTypeIds.map((roomTypeId) => ({
    organizationId: input.organizationId,
    propertyId: input.propertyId,
    roomTypeId,
    startDate: input.startDate,
    endDate: input.endDate,
    reason: input.reason
  }));
};
