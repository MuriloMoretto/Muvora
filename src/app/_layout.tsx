import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { colors } from '../constants/theme';
import { getDb } from '../db/database';
import { setupNotifications } from '../services/notifications';

export default function RootLayout() {
  useEffect(() => {
    getDb();
    setupNotifications();
  }, []);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary, headerTitleAlign: 'center' }}>
      <Tabs.Screen name="index" options={{ title: 'Painel' }} />
      <Tabs.Screen name="tarefas" options={{ title: 'Tarefas' }} />
      <Tabs.Screen name="datas" options={{ title: 'Datas' }} />
    </Tabs>
  );
}
