import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CurrencyPicker from '../components/CurrencyPicker';
import ConversionHistory from '../components/ConversionHistory';
import { fetchCurrencies, fetchRate } from '../services/api';
import colors from '../colors';

const STORAGE_KEY = 'selected-currencies';

function formatMoney(value, code) {
  // valores muito pequenos (ex: 1 BRL em BTC) precisam de mais casas
  const decimals = value > 0 && value < 1 ? 6 : 2;
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
  return `${formatted} ${code}`;
}

export default function ConverterScreen({ navigation }) {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const pair = JSON.parse(saved);
          setFrom(pair.from);
          setTo(pair.to);
        }
      } catch {
        // se falhar fica com USD/BRL mesmo
      }

      try {
        setCurrencies(await fetchCurrencies());
      } catch {
        setError('Não foi possível carregar as moedas. Verifique sua internet e reabra o app.');
      }
    }
    load();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ from, to })).catch(() => {});
  }, [from, to]);

  function swap() {
    setFrom(to);
    setTo(from);
  }

  async function convert() {
    Keyboard.dismiss();
    setError(null);

    const value = Number(amount.replace(',', '.'));
    if (!amount || isNaN(value)) {
      setError('Digite um valor válido.');
      return;
    }
    if (from === to) {
      setError('Escolha duas moedas diferentes.');
      return;
    }

    setLoading(true);
    try {
      const rate = await fetchRate(from, to);
      const converted = value * rate.bid;

      const result = {
        text: `${formatMoney(value, from)} = ${formatMoney(converted, to)}`,
        unitRate: `1 ${from} = ${formatMoney(rate.bid, to)}`,
        date: rate.date,
      };

      setHistory((prev) =>
        [`${formatMoney(value, from)} → ${formatMoney(converted, to)}`, ...prev].slice(0, 5)
      );

      navigation.navigate('Result', { result, from, to });
    } catch {
      setError('Não foi possível buscar a cotação. Verifique sua internet ou tente outro par de moedas.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* no iOS o teclado numérico não tem botão de ok, então tocar fora fecha */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              keyboardAppearance="dark"
              placeholder="Ex.: 100"
              placeholderTextColor={colors.mutedText}
              value={amount}
              onChangeText={setAmount}
            />

            {currencies.length === 0 ? (
              <ActivityIndicator color={colors.green} size="large" style={styles.spinner} />
            ) : (
              <View>
                <CurrencyPicker label="De" currencies={currencies} selected={from} onChange={setFrom} />

                <TouchableOpacity style={styles.swapButton} onPress={swap}>
                  <Text style={styles.swapText}>⇅ inverter</Text>
                </TouchableOpacity>

                <CurrencyPicker label="Para" currencies={currencies} selected={to} onChange={setTo} />

                <TouchableOpacity style={styles.button} onPress={convert} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator color={colors.darkGreen} />
                  ) : (
                    <Text style={styles.buttonText}>Converter</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <ConversionHistory items={history} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 10, paddingHorizontal: 20 },
  label: { fontSize: 14, color: colors.mutedText, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: colors.card, borderRadius: 10, padding: 14, fontSize: 18, color: colors.text },
  spinner: { marginTop: 40 },
  swapButton: { alignSelf: 'center', marginTop: 10 },
  swapText: { color: colors.green, fontSize: 16, fontWeight: '600' },
  button: { backgroundColor: colors.green, borderRadius: 10, padding: 16, marginTop: 24 },
  buttonText: { color: colors.darkGreen, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  error: { color: colors.red, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
