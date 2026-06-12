/**
 * ============================================================================
 * COMPONENTE MODERN CARD - Card com efeito vidro e animação
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography } from '@/styles/theme';

interface ModernCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  variant?: 'glass' | 'solid' | 'gradient';
  children?: React.ReactNode;
}

export function ModernCard({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  variant = 'solid',
  children 
}: ModernCardProps) {
  
  const scaleAnim = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  
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
        {variant === 'gradient' && (
          <LinearGradient
            colors={['#002ce8', '#6a42fe', '#c859ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          />
        )}
        
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  solidCard: {
    backgroundColor: colors.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  content: {
    padding: spacing.lg,
  },
  iconContainer: {
    marginBottom: spacing.sm,
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