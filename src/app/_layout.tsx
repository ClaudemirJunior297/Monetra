// Importação do componente Stack Navigator do Expo Router
import { Stack } from 'expo-router';
// Importação do Provider de autenticação (contexto)
import { AuthProvider } from '@/contexts/AuthContext';
// Importação do Provider de transações (contexto)
import { TransactionProvider } from '@/contexts/TransactionContext';

// Componente principal de layout da aplicação (root layout)
export default function RootLayout() {
  return (
    // Provider de autenticação - disponibiliza dados do usuário para toda a aplicação
    <AuthProvider>
      {/* Provider de transações - disponibiliza dados financeiros para toda a aplicação */}
      {/* Nota: TransactionProvider depende do AuthProvider (precisa do user autenticado) */}
      <TransactionProvider>
        {/* Stack Navigator - gerencia a navegação entre telas em pilha */}
        {/* screenOptions: configurações padrão para todas as telas */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* Tela de login/entrada (primeira tela exibida) */}
          <Stack.Screen name="index" />
          
          {/* Tela de cadastro de novo usuário */}
          <Stack.Screen name="signup" />
          
          {/* Grupo de telas com abas (Dashboard, Transações, Add, Gráficos, Perfil) */}
          {/* O nome "(tabs)" indica um layout com navegação por abas */}
          <Stack.Screen name="(tabs)" />
        </Stack>
      </TransactionProvider>
    </AuthProvider>
  );
}