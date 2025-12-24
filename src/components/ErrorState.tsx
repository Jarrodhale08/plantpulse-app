import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

function ErrorState({
  title = 'Something went wrong',
  message = 'An error occurred. Please try again.',
  onRetry,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: ErrorStateProps) {
  const containerStyle = [
    styles.container,
    style,
  ];

  const buttonStyle = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
  ];

  const buttonTextStyle = [
    styles.buttonText,
    styles[`buttonText_${variant}`],
    styles[`buttonText_${size}`],
    disabled && styles.buttonText_disabled,
  ];

  const titleStyle = [
    styles.title,
    styles[`title_${size}`],
  ];

  const messageStyle = [
    styles.message,
    styles[`message_${size}`],
  ];

  return (
    <View style={containerStyle} accessibilityRole="alert">
      <Text style={titleStyle} accessibilityLabel={title}>
        {title}
      </Text>
      <Text style={messageStyle} accessibilityLabel={message}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={buttonStyle}
          onPress={onRetry}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Retry"
          accessibilityState={{ disabled }}
        >
          <Text style={buttonTextStyle}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  title_sm: {
    fontSize: 16,
  },
  title_md: {
    fontSize: 20,
  },
  title_lg: {
    fontSize: 24,
  },
  message: {
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
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
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 16,
  },
  button_sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  button_md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  button_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  button_primary: {
    backgroundColor: '#F59E0B',
  },
  button_secondary: {
    backgroundColor: '#6B7280',
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  button_ghost: {
    backgroundColor: 'transparent',
  },
  button_danger: {
    backgroundColor: '#EF4444',
  },
  button_disabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonText_sm: {
    fontSize: 12,
  },
  buttonText_md: {
    fontSize: 14,
  },
  buttonText_lg: {
    fontSize: 16,
  },
  buttonText_primary: {
    color: '#FFFFFF',
  },
  buttonText_secondary: {
    color: '#FFFFFF',
  },
  buttonText_outline: {
    color: '#F59E0B',
  },
  buttonText_ghost: {
    color: '#F59E0B',
  },
  buttonText_danger: {
    color: '#FFFFFF',
  },
  buttonText_disabled: {
    opacity: 0.7,
  },
});

export { ErrorState };
export default memo(ErrorState);
