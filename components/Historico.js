import { StyleSheet, Text, View } from 'react-native';
import cores from '../cores';

export default function Historico({ itens }) {
  if (itens.length === 0) {
    return null;
  }

  return (
    <View style={styles.area}>
      <Text style={styles.titulo}>Últimas conversões</Text>
      {itens.map((item, indice) => (
        <Text key={indice} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  area: { backgroundColor: cores.cartao, borderRadius: 10, padding: 14, marginTop: 24 },
  titulo: { color: cores.textoSuave, fontSize: 13, marginBottom: 8, textTransform: 'uppercase' },
  item: { color: cores.texto, fontSize: 15, paddingVertical: 3 },
});
