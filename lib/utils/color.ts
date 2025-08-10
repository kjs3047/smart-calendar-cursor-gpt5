export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().replace('#', '');
  const val =
    m.length === 3
      ? m
          .split('')
          .map((c) => c + c)
          .join('')
      : m;
  if (val.length !== 6) return null;
  const num = parseInt(val, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getContrastingTextColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#0F172A';
  const lum = luminance(rgb);
  return lum > 0.35 ? '#0F172A' : '#FFFFFF';
}
