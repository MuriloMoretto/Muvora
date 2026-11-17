import { getDb } from './database';
import type { NewTask, Task } from '../types';

type Row = {
  id: number; title: string; description: string | null; category: Task['category'];
  due_at: string | null; done: number; remind_minutes_before: number; notification_id: string | null;
};

const toTask = (r: Row): Task => ({
  id: r.id, title: r.title, description: r.description, category: r.category,
  dueAt: r.due_at, done: r.done === 1, remindMinutesBefore: r.remind_minutes_before,
  notificationId: r.notification_id,
});

export const tasksRepository = {
  async list(): Promise<Task[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<Row>(
      'SELECT * FROM tasks ORDER BY done ASC, due_at IS NULL, due_at ASC',
    );
    return rows.map(toTask);
  },

  async get(id: number): Promise<Task | null> {
    const db = await getDb();
    const row = await db.getFirstAsync<Row>('SELECT * FROM tasks WHERE id = ?', id);
    return row ? toTask(row) : null;
  },

  async create(t: NewTask): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO tasks (title, description, category, due_at, remind_minutes_before)
       VALUES (?, ?, ?, ?, ?)`,
      t.title, t.description, t.category, t.dueAt, t.remindMinutesBefore,
    );
    return res.lastInsertRowId;
  },

  async update(id: number, t: Partial<NewTask> & { done?: boolean }): Promise<void> {
    const db = await getDb();
    const current = await this.get(id);
    if (!current) return;
    const m = { ...current, ...t };
    await db.runAsync(
      `UPDATE tasks SET title=?, description=?, category=?, due_at=?, done=?, remind_minutes_before=?
       WHERE id=?`,
      m.title, m.description, m.category, m.dueAt, m.done ? 1 : 0, m.remindMinutesBefore, id,
    );
  },

  async setNotificationId(id: number, notificationId: string | null): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE tasks SET notification_id=? WHERE id=?', notificationId, id);
  },

  async remove(id: number): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM tasks WHERE id=?', id);
  },
};
