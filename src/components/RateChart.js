import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';
import colors from '../colors';

const WIDTH = Dimensions.get('window').width - 68;
const HEIGHT = 150;

function shortNumber(value) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: value < 1 ? 5 : 2 });
}

export default function RateChart({ data }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => ({
    x: (i / (data.length - 1)) * (WIDTH - 10) + 5,
    y: HEIGHT - 10 - ((value - min) / range) * (HEIGHT - 20),
  }));

  const lineColor = data[data.length - 1] >= data[0] ? colors.green : colors.red;
  const last = points[points.length - 1];

  return (
    <View>
      <Svg width={WIDTH} height={HEIGHT}>
        <Polyline
          points={points.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke={lineColor}
          strokeWidth="3"
        />
        <Circle cx={last.x} cy={last.y} r="5" fill={lineColor} />
      </Svg>
      <View style={styles.legend}>
        <Text style={styles.legendText}>mín {shortNumber(min)}</Text>
        <Text style={styles.legendText}>máx {shortNumber(max)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  legendText: { color: colors.mutedText, fontSize: 12 },
});
