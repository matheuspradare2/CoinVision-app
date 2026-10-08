import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import RateChart from '../components/RateChart';
import { fetchHistory } from '../services/api';
import colors from '../colors';

export default function ResultScreen({ route }) {
  const { result, from, to } = route.params;
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory(from, to)
      .then(setHistory)
      .catch(() => setHistory(null))
      .finally(() => setLoading(false));
  }, []);

  let change = 0;
  if (history) {
    change = ((history[history.length - 1] - history[0]) / history[0]) * 100;
  }
  const isUp = change >= 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.resultBox}>
        <Text style={styles.result}>{result.text}</Text>
        <Text style={styles.rate}>{result.unitRate}</Text>
        <Text style={styles.date}>Cotação de {result.date}</Text>
      </View>

      {loading && <ActivityIndicator color={colors.green} size="large" style={styles.spinner} />}

      {history && (
        <View style={styles.chartBox}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Últimos 30 dias</Text>
            <Text style={[styles.change, { color: isUp ? colors.green : colors.red }]}>
              {isUp ? '▲ alta' : '▼ baixa'} {Math.abs(change).toFixed(2).replace('.', ',')}%
            </Text>
          </View>
          <RateChart data={history} />
        </View>
      )}

      {!loading && !history && <Text style={styles.empty}>Sem histórico disponível para esse par.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
  resultBox: { alignItems: 'center', marginTop: 30 },
  result: { fontSize: 24, fontWeight: 'bold', color: colors.green, textAlign: 'center' },
  rate: { fontSize: 16, color: colors.text, marginTop: 8 },
  date: { fontSize: 12, color: colors.mutedText, marginTop: 4 },
  spinner: { marginTop: 50 },
  chartBox: { backgroundColor: colors.card, borderRadius: 10, padding: 14, marginTop: 30 },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: { color: colors.mutedText, fontSize: 13, textTransform: 'uppercase' },
  change: { fontSize: 15, fontWeight: 'bold' },
  empty: { color: colors.mutedText, textAlign: 'center', marginTop: 50 },
});
