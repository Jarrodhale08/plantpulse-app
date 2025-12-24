import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

function Button({
  title = 'Button',
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const containerStyle: ViewStyle[] = [
    styles.container,
    styles[`container_${size}`],
    styles[`container_${variant}`],
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_${variant}`],
  ];

  if (disabled || loading) {
    containerStyle.push(styles.container_disabled);
    textStyle.push(styles.text_disabled);
  }

  if (style) {
    containerStyle.push(style);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#F59E0B'}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44,
    minWidth: 44,
  },
  container_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
  },
  container_md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
  },
  container_lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 52,
  },
  container_primary: {
    backgroundColor: '#F59E0B',
  },
  container_secondary: {
    backgroundColor: '#6B7280',
  },
  container_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  container_ghost: {
    backgroundColor: 'transparent',
  },
  container_danger: {
    backgroundColor: '#EF4444',
  },
  container_disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 18,
  },
  text_primary: {
    color: '#FFFFFF',
  },
  text_secondary: {
    color: '#FFFFFF',
  },
  text_outline: {
    color: '#F59E0B',
  },
  text_ghost: {
    color: '#F59E0B',
  },
  text_danger: {
    color: '#FFFFFF',
  },
  text_disabled: {
    opacity: 1,
  },
});

export { Button };
export default memo(Button);
