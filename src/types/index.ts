export type Category = 'pessoal' | 'trabalho' | 'familia' | 'saude' | 'financas' | 'outros';

export interface ImportantDate {
  id: number;
  title: string;
  /** Data de referência no formato ISO (YYYY-MM-DD). */
  date: string;
  category: Category;
  notes: string | null;
  repeatsYearly: boolean;
  /** Antecedência do lembrete, em dias. */
  remindDaysBefore: number;
  notificationId: string | null;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  category: Category;
  /** Prazo em ISO 8601 (data e hora) ou null. */
  dueAt: string | null;
  done: boolean;
  /** Antecedência do lembrete, em minutos. */
  remindMinutesBefore: number;
  notificationId: string | null;
}

export type NewImportantDate = Omit<ImportantDate, 'id' | 'notificationId'>;
export type NewTask = Omit<Task, 'id' | 'notificationId' | 'done'>;
