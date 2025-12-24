import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface CardProps {
  title?: string;
  description?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
}

function Card({
  title,
  description,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  style,
}: CardProps) {
  const containerStyle = [
    styles.container,
    styles[`${variant}Container` as keyof typeof styles] as ViewStyle,
    styles[`${size}Container` as keyof typeof styles] as ViewStyle,
    disabled && styles.disabledContainer,
    style,
  ];

  const titleStyle = [
    styles.title,
    styles[`${variant}Title` as keyof typeof styles] as TextStyle,
    styles[`${size}Title` as keyof typeof styles] as TextStyle,
    disabled && styles.disabledText,
  ];

  const descriptionStyle = [
    styles.description,
    styles[`${variant}Description` as keyof typeof styles] as TextStyle,
    styles[`${size}Description` as keyof typeof styles] as TextStyle,
    disabled && styles.disabledText,
  ];

  const content = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#F59E0B'}
          style={styles.loader}
        />
      )}
      {title && <Text style={titleStyle}>{title}</Text>}
      {description && <Text style={descriptionStyle}>{description}</Text>}
      {children}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={title || 'Card button'}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={containerStyle}
      accessibilityRole="text"
      accessibilityLabel={title || 'Card'}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  primaryContainer: {
    backgroundColor: '#F59E0B',
    padding: 16,
  },
  secondaryContainer: {
    backgroundColor: '#6B7280',
    padding: 16,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F59E0B',
    padding: 16,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
    padding: 16,
  },
  dangerContainer: {
    backgroundColor: '#EF4444',
    padding: 16,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  smContainer: {
    padding: 8,
  },
  mdContainer: {
    padding: 16,
  },
  lgContainer: {
    padding: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  primaryTitle: {
    color: '#FFFFFF',
  },
  secondaryTitle: {
    color: '#FFFFFF',
  },
  outlineTitle: {
    color: '#F59E0B',
  },
  ghostTitle: {
    color: '#1F2937',
  },
  dangerTitle: {
    color: '#FFFFFF',
  },
  smTitle: {
    fontSize: 14,
  },
  mdTitle: {
    fontSize: 16,
  },
  lgTitle: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryDescription: {
    color: '#FEF3C7',
  },
  secondaryDescription: {
    color: '#E5E7EB',
  },
  outlineDescription: {
    color: '#6B7280',
  },
  ghostDescription: {
    color: '#6B7280',
  },
  dangerDescription: {
    color: '#FEE2E2',
  },
  smDescription: {
    fontSize: 12,
  },
  mdDescription: {
    fontSize: 14,
  },
  lgDescription: {
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.6,
  },
  loader: {
    marginBottom: 8,
  },
});

export default memo(Card);
export { Card };
