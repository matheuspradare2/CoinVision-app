# 💱 CoinVision — Conversor de Moedas

> **Atividade avaliativa da faculdade.**
> Projeto desenvolvido como trabalho avaliativo da disciplina de Códicgi de alta perfomance mobile do curso de ciências da computação da faculdade: UNINASSAU- Maceió

O CoinVision é um aplicativo mobile feito com **React Native + Expo** que converte valores entre moedas do mundo todo usando cotações em tempo real, e mostra como o par escolhido se comportou nos últimos 30 dias.

---

## ✨ Funcionalidades

- **Conversão em tempo real** entre dezenas de moedas (incluindo criptomoedas), com cotações da [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).
- **Busca de moedas** por nome ou código em uma lista com pesquisa.
- **Botão de inverter** (⇅) para trocar rapidamente a moeda de origem e destino.
- **Cotação cruzada automática**: quando a API não tem o par direto (ex.: `USD → SOL`), o app calcula a conversão passando pelo real.
- **Tela de resultado** com o valor convertido, a cotação unitária e a data da cotação.
- **Gráfico dos últimos 30 dias** com mínima, máxima e variação percentual (▲ alta / ▼ baixa).
- **Histórico** das 5 últimas conversões da sessão.
- **Lembra o último par de moedas** escolhido, mesmo depois de fechar o app (AsyncStorage).
- **Tema escuro** com paleta centralizada em um único arquivo.

## 🛠️ Tecnologias

| Tecnologia | Para quê |
| --- | --- |
| [Expo](https://expo.dev) | Ambiente de desenvolvimento e execução do app |
| [React Native](https://reactnative.dev) | Interface mobile |
| [React Navigation](https://reactnavigation.org) | Navegação entre as telas (native stack) |
| [react-native-svg](https://github.com/software-mansion/react-native-svg) | Desenho do gráfico de cotação |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Salvar o par de moedas escolhido |
| [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas) | Cotações atuais e históricas (gratuita, sem chave) |

## 📁 Estrutura do projeto

```
conversor-moedas/
├── App.js                  # Navegação entre as telas
├── index.js                # Ponto de entrada do Expo
├── api.js                  # Chamadas à AwesomeAPI (moedas, cotação, histórico)
├── cores.js                # Paleta de cores do app
├── telas/
│   ├── TelaConversor.js    # Tela inicial: valor, moedas e botão de converter
│   └── TelaResultado.js    # Resultado da conversão + gráfico de 30 dias
├── components/
│   ├── SeletorMoeda.js     # Campo que abre a lista de moedas com busca
│   ├── Historico.js        # Lista das últimas conversões
│   └── GraficoCotacao.js   # Gráfico de linha em SVG
└── assets/                 # Ícones e splash screen
```

## 🚀 Como rodar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org) (versão LTS recomendada)
- [Git](https://git-scm.com)
- Para testar no celular: o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- _Opcional:_ emulador Android (Android Studio) ou simulador iOS (Xcode, só no macOS)

### Passo a passo

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd conversor-moedas
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Inicie o servidor do Expo**

   ```bash
   npx expo start
   ```

4. **Abra o app**

   - **No celular:** abra o Expo Go e escaneie o QR Code que aparece no terminal (no iOS, use a câmera do próprio iPhone). O celular e o computador precisam estar **na mesma rede Wi-Fi**.
   - **No emulador Android:** com o emulador aberto, pressione `a` no terminal.
   - **No simulador iOS:** pressione `i` no terminal (apenas macOS).
   - **No navegador:** pressione `w` no terminal.

### Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm start` | Inicia o servidor do Expo |
| `npm run android` | Inicia e abre no emulador/dispositivo Android |
| `npm run ios` | Inicia e abre no simulador iOS |
| `npm run web` | Inicia e abre no navegador |

### Problemas comuns

- **O QR Code não conecta:** confira se o celular e o computador estão na mesma rede. Se não der, rode `npx expo start --tunnel`.
- **"Não foi possível carregar as moedas":** o app precisa de internet para acessar a AwesomeAPI.
- **Erro estranho depois de instalar pacotes:** limpe o cache com `npx expo start -c`.

## 📱 Como usar

1. Digite o valor que deseja converter.
2. Escolha a moeda de origem (**De**) e a de destino (**Para**) — use a busca para achar mais rápido.
3. Toque em **Converter**.
4. Na tela de resultado, veja o valor convertido e o gráfico do par nos últimos 30 dias.

## 👤 Autor

**Matheus** — trabalho acadêmico desenvolvido para fins de avaliação.
