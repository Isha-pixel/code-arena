// src/utils/verdict.ts
export function verdictColor(verdict?: string) {
  if (!verdict) return 'gray';
  return verdict.toLowerCase().includes('accept') ? 'green' : 'red';
}
