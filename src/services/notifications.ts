import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { datesRepository } from '../db/datesRepository';
import { tasksRepository } from '../db/tasksRepository';
import type { ImportantDate, Task } from '../types';
import { nextOccurrence } from '../utils/date';

const CHANNEL_ID = 'muvora-lembretes';

/** Chamar uma vez na inicialização do app (ver src/app/_layout.tsx). */
export async function setupNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

async function schedule(title: string, body: string, when: Date): Promise<string | null> {
  if (when.getTime() <= Date.now()) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: when,
      channelId: CHANNEL_ID,
    },
  });
}

async function cancel(notificationId: string | null) {
  if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId);
}

/** (Re)agenda o lembrete de uma tarefa. Chamar após criar/editar/concluir/excluir. */
export async function syncTaskReminder(task: Task): Promise<void> {
  await cancel(task.notificationId);
  let newId: string | null = null;
  if (!task.done && task.dueAt && (await ensurePermission())) {
    const when = new Date(new Date(task.dueAt).getTime() - task.remindMinutesBefore * 60_000);
    newId = await schedule('Tarefa pendente', task.title, when);
  }
  await tasksRepository.setNotificationId(task.id, newId);
}

/** (Re)agenda o lembrete de uma data importante (próxima ocorrência, às 9h). */
export async function syncDateReminder(item: ImportantDate): Promise<void> {
  await cancel(item.notificationId);
  let newId: string | null = null;
  const next = nextOccurrence(item.date, item.repeatsYearly);
  if (next && (await ensurePermission())) {
    const when = new Date(next);
    when.setDate(when.getDate() - item.remindDaysBefore);
    when.setHours(9, 0, 0, 0);
    newId = await schedule('Data importante', item.title, when);
  }
  await datesRepository.setNotificationId(item.id, newId);
}

export async function cancelReminder(notificationId: string | null) {
  await cancel(notificationId);
}
