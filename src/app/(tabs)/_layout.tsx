import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from "react-native";
import { useRef, useEffect } from "react";
import { colors } from "@/styles/theme";

const { width } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

function AnimatedTabBar({ state, descriptors, navigation }: any) {
  const animations = useRef(
    state.routes.map((_: any, i: number) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;

  useEffect(() => {
    animations.forEach((anim: Animated.Value, i: number) => {
      Animated.spring(anim, {
        toValue: i === state.index ? 1 : 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    });
  }, [state.index]);

  const icons: Record<string, string> = {
    index: "home",
    transaction: "list",
    add: "plus-circle",
    graphs: "pie-chart",
    profile: "user",
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, i: number) => {
          const isFocused = state.index === i;
          const anim = animations[i];

          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20],
          });

          const scale = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          });

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tab}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.iconWrapper,
                  isFocused && styles.activeWrapper,
                  { transform: [{ translateY }, { scale }] },
                ]}
              >
                <Feather
                  name={icons[route.name] as any}
                  size={22}
                  color={isFocused ? colors.black : colors.textSecondary}
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1E1E2E",
    marginHorizontal: 16,
    borderRadius: 30,
    height: 64,
    alignItems: "center",
    shadowColor: "#c859ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  activeWrapper: {
    backgroundColor: "#c859ff",
    shadowColor: "#c859ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.white,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="transaction" options={{ title: "Transacoes" }} />
      <Tabs.Screen name="add" options={{ title: "Adicionar" }} />
      <Tabs.Screen name="graphs" options={{ title: "Graficos" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
