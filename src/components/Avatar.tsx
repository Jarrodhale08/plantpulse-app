import React, { memo } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, Image, ImageStyle } from 'react-native';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  style?: ViewStyle;
}

function Avatar({
  source,
  name,
  size = 'md',
  variant = 'primary',
  style,
}: AvatarProps) {
  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const containerStyle = [
    styles.container,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${size}`],
    styles[`text_variant_${variant}`],
  ];

  if (source) {
    return (
      <View style={containerStyle} accessibilityRole="image" accessibilityLabel={name || 'Avatar'}>
        <Image source={source} style={styles[`image_${size}`] as ImageStyle} />
      </View>
    );
  }

  return (
    <View style={containerStyle} accessibilityRole="image" accessibilityLabel={name || 'Avatar'}>
      <Text style={textStyle}>{name ? getInitials(name) : '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  size_sm: {
    width: 32,
    height: 32,
  },
  size_md: {
    width: 44,
    height: 44,
  },
  size_lg: {
    width: 64,
    height: 64,
  },
  variant_primary: {
    backgroundColor: '#F59E0B',
  },
  variant_secondary: {
    backgroundColor: '#6B7280',
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  variant_ghost: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  variant_danger: {
    backgroundColor: '#EF4444',
  },
  text: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  text_sm: {
    fontSize: 12,
  },
  text_md: {
    fontSize: 16,
  },
  text_lg: {
    fontSize: 24,
  },
  text_variant_primary: {
    color: '#FFFFFF',
  },
  text_variant_secondary: {
    color: '#FFFFFF',
  },
  text_variant_outline: {
    color: '#F59E0B',
  },
  text_variant_ghost: {
    color: '#F59E0B',
  },
  text_variant_danger: {
    color: '#FFFFFF',
  },
  image_sm: {
    width: 32,
    height: 32,
  },
  image_md: {
    width: 44,
    height: 44,
  },
  image_lg: {
    width: 64,
    height: 64,
  },
});

export { Avatar };
export default memo(Avatar);
