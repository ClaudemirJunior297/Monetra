// Importação do componente Stack Navigator do Expo Router
import { Stack } from 'expo-router';

// Importação do Provider de autenticação (gerencia login/usuário)
import { AuthProvider } from '@/contexts/AuthContext';

// Importação do Provider de transações (gerencia dados financeiros)
import { TransactionProvider } from '@/contexts/TransactionContext';

// Função: Criar o layout principal da aplicação
export default function RootLayout() {
  return (
    <>
      {/* Provider de autenticação - envolve toda a aplicação */}
      <AuthProvider>

        {/* Provider de transações - depende do AuthProvider (precisa do usuário) */}
        <TransactionProvider>

          {/* Navegação em pilha (Stack) - gerencia transição entre telas */}
          <Stack screenOptions={{ headerShown: false }}>

            {/* Tela de login (primeira tela ao abrir o app) */}
            <Stack.Screen name="index" />

            {/* Tela de cadastro de novo usuário */}
            <Stack.Screen name="signup" />

            {/* Grupo de telas com abas (Dashboard, Transações, Add, Gráficos, Perfil) */}
            <Stack.Screen name="(tabs)" />

          </Stack>

        </TransactionProvider>

      </AuthProvider>
    </>
  );
}