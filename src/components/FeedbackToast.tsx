/* COMPONENTE: Notificações temporárias estilo toast */

import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

// Cores fixas
const COLORS = {
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  primary: "#c859ff",
  white: "#FFFFFF",
  black: "#000000",
};

interface FeedbackToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onHide: () => void;
  position?: "top" | "bottom";
}

export function FeedbackToast({
  visible,
  message,
  type = "success",
  duration = 3000,
  onHide,
  position = "top",
}: FeedbackToastProps) {
  const fadeAnim = new Animated.Value(0);

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return { backgroundColor: COLORS.success, icon: "check-circle" };
      case "error":
        return { backgroundColor: COLORS.error, icon: "alert-circle" };
      case "warning":
        return { backgroundColor: COLORS.warning, icon: "alert-triangle" };
      default:
        return { backgroundColor: COLORS.primary, icon: "info" };
    }
  };

  const { backgroundColor, icon } = getToastConfig();

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  // Define a posição
  const topPosition = position === "top" ? 60 : undefined;
  const bottomPosition = position === "bottom" ? 100 : undefined;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, backgroundColor },
        topPosition && { top: topPosition },
        bottomPosition && { bottom: bottomPosition },
      ]}
    >
      <View style={styles.content}>
        <Feather name={icon as any} size={20} color={COLORS.white} />
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity onPress={onHide} style={styles.closeButton}>
        <Feather name="x" size={18} color={COLORS.white} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});