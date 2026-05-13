// Função: Criar as abas de navegação do app
import { Tabs } from "expo-router";
import { colors } from "@/styles/theme";
import { Feather } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      // Configurações que valem para todas as abas
      screenOptions={{
        headerStyle: { backgroundColor: colors.card }, // Fundo do cabeçalho
        headerTintColor: colors.white, // Cor do texto do cabeçalho
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border }, // Estilo da barra inferior
        tabBarActiveTintColor: colors.primary, // Cor da aba ativa (verde)
        tabBarInactiveTintColor: colors.textSecondary, // Cor da aba inativa (cinza)
      }}
    >
      {/* ABA 1 - Início */}
      <Tabs.Screen
        name="index" // Nome do arquivo/rota: index.js ou index.tsx
        options={{
          title: "Início", // Título exibido no cabeçalho e na aba
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />, // Ícone da aba (casa)
        }}
      />
      
      {/* ABA 2 - Transações */}
      <Tabs.Screen
        name="transaction" // Rota correspondente a transaction.js/tsx
        options={{
          title: "Transações", // Título da aba
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />, // Ícone de lista
        }}
      />
      
      {/* ABA 3 - Adicionar */}
      <Tabs.Screen
        name="add" // Rota para add.js/tsx
        options={{
          title: "Adicionar", // Título da aba
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={24} color={color} />, // Ícone de adicionar (círculo com +)
        }}
      />
      
      {/* ABA 4 - Gráficos */}
      <Tabs.Screen
        name="graphs" // Rota para graphs.js/tsx
        options={{
          title: "Gráficos", // Título da aba
          tabBarIcon: ({ color }) => <Feather name="pie-chart" size={24} color={color} />, // Ícone de gráfico de pizza
        }}
      />
      
      {/* ABA 5 - Perfil */}
      <Tabs.Screen
        name="profile" // Rota para profile.js/tsx
        options={{
          title: "Perfil", // Título da aba
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />, // Ícone de usuário
        }}
      />
    </Tabs>
  );
}