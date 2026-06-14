/**
 * COMPONENTE MODERN BUTTON - Botão com animação, gradiente e tamanhos variados
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Animated,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

// Props do componente
interface ModernButtonProps {
  label: string;                              // Texto do botão
  onPress: () => void;                        // Função ao clicar
  loading?: boolean;                          // Estado de carregamento
  disabled?: boolean;                         // Desabilitado
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';  // Estilo
  size?: 'small' | 'medium' | 'large';        // Tamanho
  icon?: React.ReactNode;                     // Ícone opcional
}

export function ModernButton({ 
  label, 
  onPress, 
  loading = false, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon
}: ModernButtonProps) {
  
  const { theme } = useTheme();
  
  // Animação de escala (usando useRef para manter referência estável)
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  // Quando pressiona: diminui o botão
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,              // Diminui 5%
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  // Quando solta: volta ao tamanho normal
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,                 // Volta ao normal
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
  // Estilo do botão baseado na variante
  const getButtonStyle = () => {
    switch(variant) {
      case 'secondary':
        return { backgroundColor: theme.colors.secondary };
      case 'outline':
        return { 
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.colors.primary,
        };
      case 'gradient':
        return { backgroundColor: 'transparent' };
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };
  
  // Cor do texto baseado na variante
  const getTextStyle = () => {
    switch(variant) {
      case 'outline':
        return { color: theme.colors.primary };
      default:
        return { color: theme.colors.white };
    }
  };
  
  // Tamanho do botão baseado na prop size
  const getSizeStyle = () => {
    switch(size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };
  
  // Botão desabilitado ou em loading
  const isDisabled = disabled || loading;
  
  // Conteúdo do botão (ícone + texto ou loading)
  const ButtonContent = () => (
    <>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.colors.primary : theme.colors.white} />
      ) : (
        <Text style={[styles.buttonText, getTextStyle(), getSizeStyle()]}>
          {label}
        </Text>
      )}
    </>
  );
  
  // Botão gradiente (usando LinearGradient)
  if (variant === 'gradient' && !isDisabled) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={isDisabled}
        >
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary || '#6a42fe', '#c859ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientContainer, getSizeStyle()]}
          >
            <ButtonContent />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  // Botão normal (sem gradiente)
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), getSizeStyle(), isDisabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={isDisabled}
      >
        <ButtonContent />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',       // Ícone e texto na mesma linha
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,           // Botão bem arredondado
    gap: 8,                     // Espaço entre ícone e texto
  },
  gradientContainer: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',          // Semi-negrito
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 60,
  },
  disabled: {
    opacity: 0.55,              // Botão desabilitado fica transparente
  },
  iconContainer: {
    marginRight: 8,             // Espaço entre ícone e texto
  },
});