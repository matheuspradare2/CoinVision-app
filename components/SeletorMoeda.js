import { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import cores from '../cores';

export default function SeletorMoeda({ rotulo, moedas, selecionada, aoMudar }) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState('');

  const moedaAtual = moedas.find((moeda) => moeda.codigo === selecionada);
  const filtradas = moedas.filter((moeda) =>
    moeda.nome.toLowerCase().includes(busca.toLowerCase())
  );

  function escolher(codigo) {
    aoMudar(codigo);
    setAberto(false);
    setBusca('');
  }

  return (
    <View>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <TouchableOpacity style={styles.campo} onPress={() => setAberto(true)}>
        <Text style={styles.textoCampo}>{moedaAtual ? moedaAtual.nome : selecionada}</Text>
        <Text style={styles.seta}>▾</Text>
      </TouchableOpacity>

      <Modal visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
        <View style={styles.modal}>
          <View style={styles.cabecalho}>
            <Text style={styles.tituloModal}>{rotulo} qual moeda?</Text>
            <TouchableOpacity onPress={() => setAberto(false)}>
              <Text style={styles.fechar}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.busca}
            placeholder="Buscar moeda..."
            placeholderTextColor={cores.textoSuave}
            keyboardAppearance="dark"
            value={busca}
            onChangeText={setBusca}
          />

          <FlatList
            data={filtradas}
            keyExtractor={(moeda) => moeda.codigo}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => escolher(item.codigo)}>
                <Text
                  style={[styles.textoItem, item.codigo === selecionada && styles.itemSelecionado]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontSize: 14, color: cores.textoSuave, marginBottom: 6, marginTop: 14 },
  campo: {
    backgroundColor: cores.cartao,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoCampo: { color: cores.texto, fontSize: 16, flex: 1 },
  seta: { color: cores.verde, fontSize: 16, marginLeft: 8 },

  modal: { flex: 1, backgroundColor: cores.fundo, paddingTop: 70, paddingHorizontal: 20 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloModal: { color: cores.texto, fontSize: 20, fontWeight: 'bold' },
  fechar: { color: cores.verde, fontSize: 16, fontWeight: '600' },
  busca: {
    backgroundColor: cores.cartao,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: cores.texto,
    marginBottom: 10,
  },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: cores.cartao },
  textoItem: { color: cores.texto, fontSize: 16 },
  itemSelecionado: { color: cores.verde, fontWeight: 'bold' },
});
