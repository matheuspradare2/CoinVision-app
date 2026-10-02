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
import SeletorMoeda from '../components/SeletorMoeda';
import Historico from '../components/Historico';
import { buscarMoedas, buscarCotacao } from '../api';
import cores from '../cores';

function formatar(numero, codigo) {
  // moedas "caras" (ex.: 1 BRL em SOL ou BTC) viram frações minúsculas — mostra mais casas
  const casas = numero > 0 && numero < 1 ? 6 : 2;
  return `${numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: casas })} ${codigo}`;
}

export default function TelaConversor({ navigation }) {
  const [moedas, setMoedas] = useState([]);
  const [valor, setValor] = useState('');
  const [moedaDe, setMoedaDe] = useState('USD');
  const [moedaPara, setMoedaPara] = useState('BRL');
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // Roda uma vez quando o app abre: recupera as moedas salvas e busca a lista na API
  useEffect(() => {
    async function iniciar() {
      try {
        const salvas = await AsyncStorage.getItem('moedas-escolhidas');
        if (salvas) {
          const { de, para } = JSON.parse(salvas);
          setMoedaDe(de);
          setMoedaPara(para);
        }
      } catch {
        // sem problema, segue com USD/BRL
      }

      try {
        setMoedas(await buscarMoedas());
      } catch {
        setErro('Não foi possível carregar as moedas. Verifique sua internet e reabra o app.');
      }
    }
    iniciar();
  }, []);

  // Sempre que o par escolhido muda, salva para a próxima vez que o app abrir
  useEffect(() => {
    AsyncStorage.setItem('moedas-escolhidas', JSON.stringify({ de: moedaDe, para: moedaPara })).catch(() => {});
  }, [moedaDe, moedaPara]);

  function inverter() {
    setMoedaDe(moedaPara);
    setMoedaPara(moedaDe);
  }

  async function converter() {
    Keyboard.dismiss();
    setErro(null);

    const numero = Number(valor.replace(',', '.'));
    if (!valor || isNaN(numero)) {
      setErro('Digite um valor válido.');
      return;
    }
    if (moedaDe === moedaPara) {
      setErro('Escolha duas moedas diferentes.');
      return;
    }

    setCarregando(true);
    try {
      const cotacao = await buscarCotacao(moedaDe, moedaPara);
      const convertido = numero * Number(cotacao.bid);

      const resultado = {
        texto: `${formatar(numero, moedaDe)} = ${formatar(convertido, moedaPara)}`,
        unitaria: `1 ${moedaDe} = ${formatar(Number(cotacao.bid), moedaPara)}`,
        atualizadoEm: cotacao.create_date,
      };

      setHistorico((anterior) =>
        [`${formatar(numero, moedaDe)} → ${formatar(convertido, moedaPara)}`, ...anterior].slice(0, 5)
      );

      // abre a tela de resultado, levando os dados junto
      navigation.navigate('Resultado', { resultado, de: moedaDe, para: moedaPara });
    } catch {
      setErro('Não foi possível buscar a cotação. Verifique sua internet ou tente outro par de moedas.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* teclado numérico do iOS não tem tecla de confirmar, então tocar fora fecha */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Text style={styles.rotulo}>Valor</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              keyboardAppearance="dark"
              placeholder="Ex.: 100"
              placeholderTextColor={cores.textoSuave}
              value={valor}
              onChangeText={setValor}
            />

            {moedas.length === 0 ? (
              <ActivityIndicator color={cores.verde} size="large" style={styles.carregandoMoedas} />
            ) : (
              <View>
                <SeletorMoeda rotulo="De" moedas={moedas} selecionada={moedaDe} aoMudar={setMoedaDe} />

                <TouchableOpacity style={styles.botaoInverter} onPress={inverter}>
                  <Text style={styles.textoInverter}>⇅ inverter</Text>
                </TouchableOpacity>

                <SeletorMoeda rotulo="Para" moedas={moedas} selecionada={moedaPara} aoMudar={setMoedaPara} />

                <TouchableOpacity style={styles.botao} onPress={converter} disabled={carregando}>
                  {carregando ? (
                    <ActivityIndicator color={cores.verdeEscuro} />
                  ) : (
                    <Text style={styles.textoBotao}>Converter</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {erro && <Text style={styles.erro}>{erro}</Text>}

            <Historico itens={historico} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: 10, paddingHorizontal: 20 },
  rotulo: { fontSize: 14, color: cores.textoSuave, marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: cores.cartao, borderRadius: 10, padding: 14, fontSize: 18, color: cores.texto },
  carregandoMoedas: { marginTop: 40 },
  botaoInverter: { alignSelf: 'center', marginTop: 10 },
  textoInverter: { color: cores.verde, fontSize: 16, fontWeight: '600' },
  botao: { backgroundColor: cores.verde, borderRadius: 10, padding: 16, marginTop: 24 },
  textoBotao: { color: cores.verdeEscuro, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  erro: { color: cores.vermelho, textAlign: 'center', marginTop: 20, fontSize: 15 },
});
