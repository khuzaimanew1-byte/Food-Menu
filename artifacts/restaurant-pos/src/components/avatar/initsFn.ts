// hue palette
export const HUES = [28, 43, 195, 265, 340, 155, 0, 220];

export function getInits(name?: string): string {
  const str = name?.trim();
  if (!str) return 'AV';
  const words = str.split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function getAvatarHue(name?: string): number {
  const str = name?.trim() || 'AV';
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (str.charCodeAt(i) + ((h << 5) - h)) | 0;
  }
  return HUES[Math.abs(h) % HUES.length];
}
