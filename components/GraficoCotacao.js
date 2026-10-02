import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import cores from '../cores';

const LARGURA = Dimensions.get('window').width - 68;
const ALTURA = 150;

export default function GraficoCotacao({ serie }) {
  const minimo = Math.min(...serie);
  const maximo = Math.max(...serie);
  const faixa = maximo - minimo || 1;

  // transforma cada valor da série em um ponto x,y dentro do desenho
  const pontos = serie.map((valor, indice) => {
    const x = (indice / (serie.length - 1)) * (LARGURA - 10) + 5;
    const y = ALTURA - 10 - ((valor - minimo) / faixa) * (ALTURA - 20);
    return { x, y };
  });

  const subiu = serie[serie.length - 1] >= serie[0];
  const cor = subiu ? cores.verde : cores.vermelho;
  const ultimo = pontos[pontos.length - 1];

  function abreviar(numero) {
    const casas = numero < 1 ? 5 : 2;
    return numero.toLocaleString('pt-BR', { maximumFractionDigits: casas });
  }

  return (
    <View>
      <Svg width={LARGURA} height={ALTURA}>
        <Polyline
          points={pontos.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={cor}
          strokeWidth="3"
        />
        <Circle cx={ultimo.x} cy={ultimo.y} r="5" fill={cor} />
      </Svg>
      <View style={styles.legenda}>
        <Text style={styles.textoLegenda}>mín {abreviar(minimo)}</Text>
        <Text style={styles.textoLegenda}>máx {abreviar(maximo)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legenda: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  textoLegenda: { color: cores.textoSuave, fontSize: 12 },
});
