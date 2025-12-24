import React, { memo } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
}

function Input({
  label,
  error,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoComplete,
  accessibilityLabel,
  ...restProps
}: InputProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${size}`],
    style,
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    styles[`inputContainer_${variant}`],
    styles[`inputContainer_${size}`],
    error && styles.inputContainer_error,
    disabled && styles.inputContainer_disabled,
  ];

  const inputStyle = [
    styles.input,
    styles[`input_${size}`],
    disabled && styles.input_disabled,
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, styles[`label_${size}`], error && styles.label_error]}>
          {label}
        </Text>
      )}
      <View style={inputContainerStyle}>
        <TextInput
          style={inputStyle}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          editable={!disabled}
          accessibilityLabel={accessibilityLabel || label || placeholder}
          accessibilityRole="none"
          accessibilityState={{ disabled }}
          {...restProps}
        />
      </View>
      {error && (
        <Text style={[styles.errorText, styles[`errorText_${size}`]]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  container_sm: {
    marginBottom: 8,
  },
  container_md: {
    marginBottom: 12,
  },
  container_lg: {
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  label_sm: {
    fontSize: 12,
    marginBottom: 4,
  },
  label_md: {
    fontSize: 14,
    marginBottom: 6,
  },
  label_lg: {
    fontSize: 16,
    marginBottom: 8,
  },
  label_error: {
    color: '#EF4444',
  },
  inputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
  },
  inputContainer_primary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F59E0B',
  },
  inputContainer_secondary: {
    backgroundColor: '#F9FAFB',
    borderColor: '#6B7280',
  },
  inputContainer_outline: {
    backgroundColor: 'transparent',
    borderColor: '#D1D5DB',
  },
  inputContainer_ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  inputContainer_danger: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EF4444',
  },
  inputContainer_sm: {
    minHeight: 36,
    paddingHorizontal: 10,
  },
  inputContainer_md: {
    minHeight: 44,
    paddingHorizontal: 12,
  },
  inputContainer_lg: {
    minHeight: 52,
    paddingHorizontal: 16,
  },
  inputContainer_error: {
    borderColor: '#EF4444',
  },
  inputContainer_disabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontWeight: '400',
  },
  input_sm: {
    fontSize: 13,
    paddingVertical: 6,
  },
  input_md: {
    fontSize: 15,
    paddingVertical: 10,
  },
  input_lg: {
    fontSize: 17,
    paddingVertical: 12,
  },
  input_disabled: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '400',
  },
  errorText_sm: {
    fontSize: 11,
  },
  errorText_md: {
    fontSize: 12,
  },
  errorText_lg: {
    fontSize: 13,
  },
});

export { Input };
export default memo(Input);
