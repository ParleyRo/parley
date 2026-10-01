export function parseNumber(value: string): number | null {
  const text = value.trim().replace(',', '.');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}
export function lineLength(diameter: number, length: number, target: number) {
  if (diameter <= 0 || length <= 0 || target <= 0) throw new Error('Introdu valori mai mari decât zero.');
  const result = Math.trunc((diameter * diameter * length) / (target * target));
  if (!Number.isFinite(result)) throw new Error('Rezultatul este prea mare. Verifică valorile.');
  return result;
}
export function castingWeight(lbs: number) {
  if (lbs <= 0) throw new Error('Introdu o valoare mai mare decât zero.');
  const grams = Math.round(lbs * 28.35);
  const spread = Math.round(grams * 0.2);
  if (!Number.isFinite(grams + spread)) throw new Error('Rezultatul este prea mare. Verifică valoarea.');
  return { grams, min: grams - spread, max: grams + spread };
}
export function ruleOfThree(a: number, b: number, c: number, rounded = true) {
  if (a === 0) throw new Error('Valoarea A nu poate fi zero.');
  const result = b * c / a;
  if (!Number.isFinite(result)) throw new Error('Rezultatul este prea mare. Verifică valorile.');
  return rounded ? (Math.round(result * 100) / 100).toFixed(2) : String(result);
}
