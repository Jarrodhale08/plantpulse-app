import React, { memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface FormFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  required?: boolean;
}

interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  style?: ViewStyle;
}

export function FormField({
  label,
  error,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  required = false,
  ...inputProps
}: FormFieldProps) {
  const containerStyle = [
    styles.fieldContainer,
    styles[`fieldContainer_${size}`],
    style,
  ];

  const inputStyle = [
    styles.input,
    styles[`input_${size}`],
    styles[`input_${variant}`],
    disabled && styles.inputDisabled,
    error && styles.inputError,
  ];

  const labelStyle = [
    styles.label,
    styles[`label_${size}`],
    error && styles.labelError,
  ];

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={labelStyle} accessibilityLabel={`${label}${required ? ' required' : ''}`}>
          {label}{required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={inputStyle}
        editable={!disabled}
        accessibilityLabel={label || 'Form input'}
        accessibilityHint={error || undefined}
        {...inputProps}
      />
      {error && (
        <Text style={styles.errorText} accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

function Form({ children, onSubmit, style }: FormProps) {
  return (
    <View style={[styles.form, style]} accessibilityRole="form">
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
    width: '100%',
  },
  fieldContainer_sm: {
    marginBottom: 12,
  },
  fieldContainer_md: {
    marginBottom: 16,
  },
  fieldContainer_lg: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
  labelError: {
    color: '#DC2626',
  },
  required: {
    color: '#DC2626',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    minHeight: 44,
  },
  input_sm: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    minHeight: 36,
    borderRadius: 6,
  },
  input_md: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 44,
    borderRadius: 8,
  },
  input_lg: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 52,
    borderRadius: 8,
  },
  input_primary: {
    borderColor: '#F59E0B',
  },
  input_secondary: {
    borderColor: '#6B7280',
  },
  input_outline: {
    borderColor: '#D1D5DB',
    backgroundColor: 'transparent',
  },
  input_ghost: {
    borderColor: 'transparent',
    backgroundColor: '#F3F4F6',
  },
  input_danger: {
    borderColor: '#DC2626',
  },
  inputDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
});

export default memo(Form);
