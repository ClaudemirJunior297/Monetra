/**
 * COMPONENTE MODERN CARD - Card com animação e variantes de estilo
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '@/styles/theme';

// Props do componente
interface ModernCardProps {
  title?: string;           // Título do card
  subtitle?: string;        // Subtítulo do card
  icon?: React.ReactNode;   // Ícone no topo
  onPress?: () => void;     // Função ao clicar (torna o card clicável)
  variant?: 'glass' | 'solid' | 'gradient';  // Estilo do card
  children?: React.ReactNode;  // Conteúdo interno
}

export function ModernCard({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  variant = 'solid',
  children 
}: ModernCardProps) {
  
  // Animação de escala (diminui ao pressionar)
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,           // Diminui 2%
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,              // Volta ao normal
      useNativeDriver: true,
    }).start();
  };
  
  // Define o estilo baseado na variante
  const getCardStyle = () => {
    switch(variant) {
      case 'glass':
        return styles.glassCard;
      case 'gradient':
        return styles.gradientCard;
      default:
        return styles.solidCard;
    }
  };
  
  // Se tiver onPress, usa TouchableOpacity, senão usa View
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <CardWrapper
        style={[styles.card, getCardStyle()]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Gradiente (apenas para variant='gradient') */}
        {variant === 'gradient' && (
          <LinearGradient
            colors={['#002ce8', '#6a42fe', '#c859ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          />
        )}
        
        {/* Conteúdo do card */}
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children}
        </View>
      </CardWrapper>
    </Animated.View>
  );
}

// ========== ESTILOS DO COMPONENTE ==========
const styles = StyleSheet.create({
  card: {
    borderRadius: 24,          // Cantos bem arredondados
    overflow: 'hidden',        // Garante que o conteúdo não ultrapasse
    marginVertical: spacing.sm, // Espaço vertical entre cards
  },
  solidCard: {
    backgroundColor: colors.card,  // Fundo sólido
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,                  // Sombra no Android
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',  // Fundo semi-transparente
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    // backdropFilter removido (não funciona no React Native)
  },
  gradientCard: {
    backgroundColor: 'transparent',  // Fundo transparente (gradiente cobre)
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,  // Ocupa todo o card
    opacity: 0.9,
  },
  content: {
    padding: spacing.lg,       // Espaçamento interno
  },
  iconContainer: {
    marginBottom: spacing.sm,  // Espaço abaixo do ícone
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});