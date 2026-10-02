import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import TelaConversor from './telas/TelaConversor';
import TelaResultado from './telas/TelaResultado';
import cores from './cores';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: cores.fundo },
          headerTintColor: cores.verde,
          headerTitleStyle: { color: cores.texto, fontWeight: 'bold' },
          headerShadowVisible: false,
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: cores.fundo },
        }}
      >
        <Stack.Screen name="Conversor" component={TelaConversor} options={{ title: 'CoinVision' }} />
        <Stack.Screen name="Resultado" component={TelaResultado} options={{ title: 'Resultado' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
