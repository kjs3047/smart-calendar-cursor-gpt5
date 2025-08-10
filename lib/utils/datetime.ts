export function toLocalInputValue(input: Date | string): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  const year = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${m}-${day}T${h}:${min}`;
}

export function inputValueToIso(localValue: string): string {
  // local datetime to ISO UTC string
  return new Date(localValue).toISOString();
}
