import { formatInTimeZone } from 'date-fns-tz';

export function formatDateTimeInTz(
  date: Date | string | number,
  tz: string,
  fmt = 'yyyy-MM-dd HH:mm',
) {
  return formatInTimeZone(date, tz, fmt);
}
