/**
 * ============================================================================
 * COMPONENTE MODERN BUTTON - Botão com animação (sem Haptics)
 * ============================================================================
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

interface ModernButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
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
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
    }).start();
    // Haptics removido
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };
  
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
  
  const getTextStyle = () => {
    switch(variant) {
      case 'outline':
        return { color: theme.colors.primary };
      default:
        return { color: theme.colors.white };
    }
  };
  
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
  
  const isDisabled = disabled || loading;
  
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

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    gap: 8,
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
    fontWeight: '600',
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
    opacity: 0.55,
  },
  iconContainer: {
    marginRight: 8,
  },
});