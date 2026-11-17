import { getDb } from './database';
import type { ImportantDate, NewImportantDate } from '../types';

type Row = {
  id: number; title: string; date: string; category: ImportantDate['category'];
  notes: string | null; repeats_yearly: number; remind_days_before: number; notification_id: string | null;
};

const toDate = (r: Row): ImportantDate => ({
  id: r.id, title: r.title, date: r.date, category: r.category, notes: r.notes,
  repeatsYearly: r.repeats_yearly === 1, remindDaysBefore: r.remind_days_before,
  notificationId: r.notification_id,
});

export const datesRepository = {
  async list(): Promise<ImportantDate[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<Row>('SELECT * FROM important_dates ORDER BY date ASC');
    return rows.map(toDate);
  },

  async get(id: number): Promise<ImportantDate | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<Row>('SELECT * FROM important_dates WHERE id = ?', id);
    return row ? toDate(row) : null;
  },

  async create(d: NewImportantDate): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO important_dates (title, date, category, notes, repeats_yearly, remind_days_before)
       VALUES (?, ?, ?, ?, ?, ?)`,
      d.title, d.date, d.category, d.notes, d.repeatsYearly ? 1 : 0, d.remindDaysBefore,
    );
    return res.lastInsertRowId;
  },

  async update(id: number, d: Partial<NewImportantDate>): Promise<void> {
    const db = await getDb();
    const current = await this.get(id);
    if (!current) return;
    const m = { ...current, ...d };
    await db.runAsync(
      `UPDATE important_dates SET title=?, date=?, category=?, notes=?, repeats_yearly=?, remind_days_before=?
       WHERE id=?`,
      m.title, m.date, m.category, m.notes, m.repeatsYearly ? 1 : 0, m.remindDaysBefore, id,
    );
  },

  async setNotificationId(id: number, notificationId: string | null): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE important_dates SET notification_id=? WHERE id=?', notificationId, id);
  },

  async remove(id: number): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM important_dates WHERE id=?', id);
  },
};
