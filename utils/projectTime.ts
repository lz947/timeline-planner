import { parseAbsolute } from '@internationalized/date';
import type { DateValue } from '@react-types/datepicker';

export function getProjectTime(dateValue: DateValue): number {
  const targetDate = dateValue.toDate('UTC');

  // Base date: Jan 01, 0000 at 00:00:00 UTC
  const baseDate = new Date(Date.UTC(0, 0, 1, 0, 0, 0)); // JS uses year 0 as 0000

  const diffMs = targetDate.getTime() - baseDate.getTime();
  const projectTime = Math.floor(diffMs / 1000);

  return projectTime;
}

export function projectTimeToDateTime(projectTime: number): DateValue {
  const baseDate = new Date(Date.UTC(0, 0, 1, 0, 0, 0)); // Jan 01, 0000
  const targetDate = new Date(baseDate.getTime() + projectTime * 1000);

  const isoString = targetDate.toISOString(); // e.g., "2025-04-20T14:32:00.000Z"
  const calendarDateTime = parseAbsolute(isoString, 'UTC'); // returns CalendarDateTime

  return calendarDateTime;
}