// Funções que conversam com a AwesomeAPI (https://docs.awesomeapi.com.br/api-de-moedas)
const BASE = 'https://economia.awesomeapi.com.br/json';

// Lista de moedas disponíveis: { "USD": "Dólar Americano", ... }
export async function buscarMoedas() {
  const resposta = await fetch(`${BASE}/available/uniq`);
  if (!resposta.ok) {
    throw new Error('Falha ao buscar a lista de moedas');
  }
  const dados = await resposta.json();
  return Object.entries(dados)
    .map(([codigo, nome]) => ({ codigo, nome: `${nome} (${codigo})` }))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

// Quanto vale 1 unidade da moeda em reais
async function cotacaoEmReais(moeda) {
  if (moeda === 'BRL') {
    return { bid: 1, create_date: null };
  }
  const resposta = await fetch(`${BASE}/last/${moeda}-BRL`);
  if (!resposta.ok) {
    throw new Error(`Moeda ${moeda} sem cotação na API`);
  }
  const dados = await resposta.json();
  const cotacao = dados[`${moeda}BRL`];
  return { bid: Number(cotacao.bid), create_date: cotacao.create_date };
}

// Cotação de um par. Tenta o par direto; se a API não tiver (ex.: USD-SOL),
// calcula a cotação cruzada via real: USD→SOL = (USD→BRL) ÷ (SOL→BRL)
export async function buscarCotacao(de, para) {
  const resposta = await fetch(`${BASE}/last/${de}-${para}`);
  if (resposta.ok) {
    const dados = await resposta.json();
    const direto = dados[`${de}${para}`];
    if (direto) {
      return { bid: Number(direto.bid), create_date: direto.create_date };
    }
  }

  const [deEmReais, paraEmReais] = await Promise.all([
    cotacaoEmReais(de),
    cotacaoEmReais(para),
  ]);

  return {
    bid: deEmReais.bid / paraEmReais.bid,
    create_date: deEmReais.create_date || paraEmReais.create_date,
  };
}

// Fechamentos diários do par, do mais antigo para o mais recente.
// Retorna null quando a API não tem histórico para esse par.
export async function buscarHistorico(de, para, dias = 30) {
  async function serie(par, inverter) {
    const resposta = await fetch(`${BASE}/daily/${par}/${dias}`);
    if (!resposta.ok) {
      return null;
    }
    const dados = await resposta.json();
    if (!Array.isArray(dados) || dados.length < 2) {
      return null;
    }
    return dados
      .map((dia) => (inverter ? 1 / Number(dia.bid) : Number(dia.bid)))
      .reverse();
  }

  // BRL→X não existe como par direto; usa o inverso de X→BRL
  if (de === 'BRL') {
    return serie(`${para}-BRL`, true);
  }
  return serie(`${de}-${para}`, false);
}
