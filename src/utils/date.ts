/** Converte "YYYY-MM-DD" em Date local (evita deslocamento de fuso). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISODate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** Próxima ocorrência de uma data (considerando repetição anual). */
export function nextOccurrence(iso: string, repeatsYearly: boolean, from = new Date()): Date | null {
  const ref = parseISODate(iso);
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (!repeatsYearly) return ref >= today ? ref : null;
  const candidate = new Date(today.getFullYear(), ref.getMonth(), ref.getDate());
  if (candidate < today) candidate.setFullYear(today.getFullYear() + 1);
  return candidate;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}
