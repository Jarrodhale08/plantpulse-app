import React, { memo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

function EmptyState({
  title = 'No Data',
  message = 'There is nothing to display here.',
  icon = 'folder-open-outline',
  variant = 'primary',
  size = 'md',
  style,
}: EmptyStateProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
    style,
  ];

  const iconSize = size === 'sm' ? 40 : size === 'lg' ? 80 : 60;
  const iconColor = variant === 'primary' ? '#F59E0B' : variant === 'danger' ? '#EF4444' : '#6B7280';

  return (
    <View style={containerStyle} accessibilityRole="text" accessibilityLabel={`${title}. ${message}`}>
      <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.icon} />
      <Text style={[styles.title, styles[`title_${size}`], styles[`title_${variant}`]]}>{title}</Text>
      <Text style={[styles.message, styles[`message_${size}`], styles[`message_${variant}`]]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
  },
  container_primary: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  container_secondary: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  container_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  container_ghost: {
    backgroundColor: 'transparent',
  },
  container_danger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  container_sm: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  container_md: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  container_lg: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  title_sm: {
    fontSize: 14,
  },
  title_md: {
    fontSize: 16,
  },
  title_lg: {
    fontSize: 20,
  },
  title_primary: {
    color: '#92400E',
  },
  title_secondary: {
    color: '#374151',
  },
  title_outline: {
    color: '#374151',
  },
  title_ghost: {
    color: '#374151',
  },
  title_danger: {
    color: '#991B1B',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
  message_sm: {
    fontSize: 12,
  },
  message_md: {
    fontSize: 14,
  },
  message_lg: {
    fontSize: 16,
  },
  message_primary: {
    color: '#78350F',
  },
  message_secondary: {
    color: '#6B7280',
  },
  message_outline: {
    color: '#6B7280',
  },
  message_ghost: {
    color: '#6B7280',
  },
  message_danger: {
    color: '#7F1D1D',
  },
});

export { EmptyState };
export default memo(EmptyState);
