import { StyleSheet, Text, View } from 'react-native';
import colors from '../colors';

export default function ConversionHistory({ items }) {
  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas conversões</Text>
      {items.map((item, index) => (
        <Text key={index} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.card, borderRadius: 10, padding: 14, marginTop: 24 },
  title: { color: colors.mutedText, fontSize: 13, marginBottom: 8, textTransform: 'uppercase' },
  item: { color: colors.text, fontSize: 15, paddingVertical: 3 },
});
