// Funcao: Criar as abas de navegacao do app

// Importa o componente de abas
import { Tabs } from "expo-router";

// Importa as cores do projeto
import { colors } from "@/styles/theme";

// Importa os icones
import { Feather } from "@expo/vector-icons";

// Funcao principal das abas
export default function TabLayout() {
  return (
    <>
      {/* Estrutura das abas */}
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.white,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >

        {/* ABA 1 - Inicio */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />

        {/* ABA 2 - Transacoes */}
        <Tabs.Screen
          name="transaction"
          options={{
            title: "Transacoes",
            tabBarIcon: ({ color }) => (
              <Feather name="list" size={24} color={color} />
            ),
          }}
        />

        {/* ABA 3 - Adicionar */}
        <Tabs.Screen
          name="add"
          options={{
            title: "Adicionar",
            tabBarIcon: ({ color }) => (
              <Feather name="plus-circle" size={24} color={color} />
            ),
          }}
        />

        {/* ABA 4 - Graficos */}
        <Tabs.Screen
          name="graphs"
          options={{
            title: "Graficos",
            tabBarIcon: ({ color }) => (
              <Feather name="pie-chart" size={24} color={color} />
            ),
          }}
        />

        {/* ABA 5 - Perfil */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => (
              <Feather name="user" size={24} color={color} />
            ),
          }}
        />

      </Tabs>
    </>
  );
}
