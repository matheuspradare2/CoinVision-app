import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import GraficoCotacao from '../components/GraficoCotacao';
import { buscarHistorico } from '../api';
import cores from '../cores';

export default function TelaResultado({ route }) {
  // os dados enviados pela tela anterior chegam em route.params
  const { resultado, de, para } = route.params;
  const [serie, setSerie] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarHistorico(de, para)
      .then(setSerie)
      .catch(() => setSerie(null))
      .finally(() => setCarregando(false));
  }, []);

  let variacao = null;
  if (serie) {
    variacao = ((serie[serie.length - 1] - serie[0]) / serie[0]) * 100;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.areaResultado}>
        <Text style={styles.resultado}>{resultado.texto}</Text>
        <Text style={styles.cotacao}>{resultado.unitaria}</Text>
        <Text style={styles.atualizadoEm}>Cotação de {resultado.atualizadoEm}</Text>
      </View>

      {carregando && <ActivityIndicator color={cores.verde} size="large" style={styles.carregandoGrafico} />}

      {serie && (
        <View style={styles.areaGrafico}>
          <View style={styles.cabecalhoGrafico}>
            <Text style={styles.tituloGrafico}>Últimos 30 dias</Text>
            <Text style={[styles.variacao, { color: variacao >= 0 ? cores.verde : cores.vermelho }]}>
              {variacao >= 0 ? '▲ alta' : '▼ baixa'}{' '}
              {Math.abs(variacao).toFixed(2).replace('.', ',')}%
            </Text>
          </View>
          <GraficoCotacao serie={serie} />
        </View>
      )}

      {!carregando && !serie && (
        <Text style={styles.semGrafico}>Sem histórico disponível para esse par.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: 20 },
  areaResultado: { alignItems: 'center', marginTop: 30 },
  resultado: { fontSize: 24, fontWeight: 'bold', color: cores.verde, textAlign: 'center' },
  cotacao: { fontSize: 16, color: cores.texto, marginTop: 8 },
  atualizadoEm: { fontSize: 12, color: cores.textoSuave, marginTop: 4 },
  carregandoGrafico: { marginTop: 50 },
  areaGrafico: { backgroundColor: cores.cartao, borderRadius: 10, padding: 14, marginTop: 30 },
  cabecalhoGrafico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tituloGrafico: { color: cores.textoSuave, fontSize: 13, textTransform: 'uppercase' },
  variacao: { fontSize: 15, fontWeight: 'bold' },
  semGrafico: { color: cores.textoSuave, textAlign: 'center', marginTop: 50 },
});
