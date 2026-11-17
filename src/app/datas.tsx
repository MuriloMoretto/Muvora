import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../constants/theme';

// TODO(MVP): listagem + formulário de criação/edição/exclusão (usar repositório em src/db e sincronizar lembretes em src/services/notifications.ts).
export default function Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Datas importantes — em construção</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.md, backgroundColor: colors.background },
  text: { color: colors.muted },
});
