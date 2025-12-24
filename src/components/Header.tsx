import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface HeaderProps {
  title?: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

function Header({
  title = 'Header',
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  leftAction,
  rightAction,
}: HeaderProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
    disabled && styles.container_disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
  ];

  const content = (
    <>
      {leftAction && <View style={styles.leftAction}>{leftAction}</View>}
      <View style={styles.titleContainer}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : '#F59E0B'} />
        ) : (
          <Text style={textStyle} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} accessibilityRole="header" accessibilityLabel={title}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 44,
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
  container_sm: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  container_md: {
    minHeight: 44,
    paddingHorizontal: 16,
  },
  container_lg: {
    minHeight: 56,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftAction: {
    marginRight: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightAction: {
    marginLeft: 12,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
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
    opacity: 0.7,
  },
  text_sm: {
    fontSize: 14,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 20,
  },
});

export { Header };
export default memo(Header);
