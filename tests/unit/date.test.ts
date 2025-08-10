import { formatDateTimeInTz } from '@/lib/utils/date';

describe('formatDateTimeInTz', () => {
  it('formats date in given timezone', () => {
    const s = formatDateTimeInTz(
      new Date('2024-01-01T00:00:00Z'),
      'Asia/Seoul',
      'yyyy-MM-dd HH:mm',
    );
    expect(s).toBe('2024-01-01 09:00');
  });
});
