// docs: https://docs.awesomeapi.com.br/api-de-moedas
const BASE_URL = 'https://economia.awesomeapi.com.br/json';

export async function fetchCurrencies() {
  const res = await fetch(`${BASE_URL}/available/uniq`);
  if (!res.ok) throw new Error('Erro ao buscar moedas');

  const data = await res.json();
  return Object.entries(data)
    .map(([code, name]) => ({ code, name: `${name} (${code})` }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchRateInBRL(currency) {
  if (currency === 'BRL') return { bid: 1, date: null };

  const res = await fetch(`${BASE_URL}/last/${currency}-BRL`);
  if (!res.ok) throw new Error(`Sem cotação para ${currency}`);

  const data = await res.json();
  const quote = data[`${currency}BRL`];
  return { bid: Number(quote.bid), date: quote.create_date };
}

export async function fetchRate(from, to) {
  const res = await fetch(`${BASE_URL}/last/${from}-${to}`);
  if (res.ok) {
    const data = await res.json();
    const quote = data[`${from}${to}`];
    if (quote) return { bid: Number(quote.bid), date: quote.create_date };
  }

  // a API não tem todos os pares (ex: USD-SOL), então calcula passando pelo real
  const [fromBRL, toBRL] = await Promise.all([fetchRateInBRL(from), fetchRateInBRL(to)]);
  return { bid: fromBRL.bid / toBRL.bid, date: fromBRL.date || toBRL.date };
}

export async function fetchHistory(from, to, days = 30) {
  // BRL-X não existe, então busca X-BRL e inverte
  const invert = from === 'BRL';
  const pair = invert ? `${to}-BRL` : `${from}-${to}`;

  const res = await fetch(`${BASE_URL}/daily/${pair}/${days}`);
  if (!res.ok) return null;

  const data = await res.json();
  if (!Array.isArray(data) || data.length < 2) return null;

  return data.map((day) => (invert ? 1 / Number(day.bid) : Number(day.bid))).reverse();
}
