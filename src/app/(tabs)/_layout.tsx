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
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="transaction"
        options={{
          title: "Transações",
          tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />,
        }}
      />
      
      {/* ABA 3 - Adicionar */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color }) => <Feather name="plus-circle" size={24} color={color} />,
        }}
      />
      
      {/* ABA 4 - Gráficos */}
      <Tabs.Screen
        name="graphs"
        options={{
          title: "Gráficos",
          tabBarIcon: ({ color }) => <Feather name="pie-chart" size={24} color={color} />,
        }}
      />
      
      {/* ABA 5 - Perfil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
