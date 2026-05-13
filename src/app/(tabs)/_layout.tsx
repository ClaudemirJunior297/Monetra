// Função: Criar as abas de navegação do app

// Importa o componente de abas
import { Tabs } from "expo-router";

// Importa as cores do projeto
import { colors } from "@/styles/theme";

// Importa os ícones
import { Feather } from "@expo/vector-icons";

// Função principal das abas
export default function TabLayout() {
  return (

    // Estrutura das abas
    <Tabs

      // Configurações gerais das abas
      screenOptions={{
        headerStyle: { backgroundColor: colors.card }, // Fundo do cabeçalho
        headerTintColor: colors.white, // Cor do texto do cabeçalho
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border
        }, // Estilo da barra inferior
        tabBarActiveTintColor: colors.primary, // Cor da aba ativa
        tabBarInactiveTintColor: colors.textSecondary, // Cor da aba inativa
      }}
    >

      {/* ABA 1 - Início */}
      <Tabs.Screen
        name="index" // Arquivo index.tsx
        options={{
          title: "Início", // Nome da aba
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} /> // Ícone da aba
          ),
        }}
      />

      {/* ABA 2 - Transações */}
      <Tabs.Screen
        name="transaction" // Arquivo transaction.tsx
        options={{
          title: "Transações", // Nome da aba
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={24} color={color} /> // Ícone da aba
          ),
        }}
      />

      {/* ABA 3 - Adicionar */}
      <Tabs.Screen
        name="add" // Arquivo add.tsx
        options={{
          title: "Adicionar", // Nome da aba
          tabBarIcon: ({ color }) => (
            <Feather name="plus-circle" size={24} color={color} /> // Ícone da aba
          ),
        }}
      />

      {/* ABA 4 - Gráficos */}
      <Tabs.Screen
        name="graphs" // Arquivo graphs.tsx
        options={{
          title: "Gráficos", // Nome da aba
          tabBarIcon: ({ color }) => (
            <Feather name="pie-chart" size={24} color={color} /> // Ícone da aba
          ),
        }}
      />

      {/* ABA 5 - Perfil */}
      <Tabs.Screen
        name="profile" // Arquivo profile.tsx
        options={{
          title: "Perfil", // Nome da aba
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} /> // Ícone da aba
          ),
        }}
      />

    </Tabs>
  );
}