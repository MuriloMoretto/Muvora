import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Empty, Section } from '../components/Section';
import { colors, spacing } from '../constants/theme';
import { datesRepository } from '../db/datesRepository';
import { tasksRepository } from '../db/tasksRepository';
import type { ImportantDate, Task } from '../types';
import { formatDate, nextOccurrence } from '../utils/date';

export default function Painel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);

  useFocusEffect(
    useCallback(() => {
      tasksRepository.list().then(setTasks);
      datesRepository.list().then(setDates);
    }, []),
  );

  const pending = tasks.filter((t) => !t.done);
  const upcoming = dates
    .map((d) => ({ d, next: nextOccurrence(d.date, d.repeatsYearly) }))
    .filter((x): x is { d: ImportantDate; next: Date } => x.next !== null)
    .sort((a, b) => a.next.getTime() - b.next.getTime())
    .slice(0, 5);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title="Tarefas pendentes">
        {pending.length === 0 ? <Empty text="Nada pendente. 🎉" /> : pending.map((t) => (
          <Text key={t.id} style={styles.item}>• {t.title}</Text>
        ))}
      </Section>
      <Section title="Próximos eventos">
        {upcoming.length === 0 ? <Empty text="Nenhum evento cadastrado." /> : upcoming.map(({ d, next }) => (
          <Text key={d.id} style={styles.item}>• {formatDate(next)} — {d.title}</Text>
        ))}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  item: { color: colors.text, paddingVertical: 2 },
});
