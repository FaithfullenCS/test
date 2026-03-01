export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^a-zа-я0-9\s%-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function seededShuffle<T>(items: T[], seed: number): T[] {
  const result = [...items];
  let currentSeed = seed + 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((currentSeed / 233280) * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
}
