// Importação do componente Stack Navigator do Expo Router
import { Stack } from 'expo-router';

// Importação do Provider de autenticação
import { AuthProvider } from '@/contexts/AuthContext';

// Importação do Provider de transações
import { TransactionProvider } from '@/contexts/TransactionContext';

// Função: Criar o layout principal da aplicação
export default function RootLayout() {
  return (
    <>
      {/* Provider responsável pela autenticação */}
      <AuthProvider>

        {/* Provider responsável pelas transações */}
        <TransactionProvider>

          {/* Navegação em pilha */}
          <Stack screenOptions={{ headerShown: false }}>

          {/* Tela inicial/login */}
          <Stack.Screen name="index" />

          {/* Tela de cadastro */}
          <Stack.Screen name="signup" />

          {/* Grupo de telas com abas */}
          <Stack.Screen name="(tabs)" />

          </Stack>

        </TransactionProvider>

      </AuthProvider>
    </>
  );
}