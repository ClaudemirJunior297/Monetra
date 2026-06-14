/* CONFIGURAÇÃO DE ANIMAÇÕES */

import { Animated } from "react-native";

// Animação para botão (efeito de clique)
export const getButtonAnimation = () => {
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.96,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };
  
  return { scaleAnim, handlePressIn, handlePressOut };
};

// Exporta vazio para não quebrar as importações
export const animations = {
  spring: {},
  timing: {},
  listItem: {},
  button: {},
  fadeIn: {},
  slideIn: {},
};