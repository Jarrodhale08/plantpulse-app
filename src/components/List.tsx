import React, { memo } from 'react';
import { View, FlatList, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ListItem {
  id: string;
  label: string;
  description?: string;
}

interface ListProps {
  data: ListItem[];
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  onItemPress?: (item: ListItem) => void;
}

function List({
  data,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
  onItemPress,
}: ListProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    disabled && styles.containerDisabled,
    style,
  ];

  const itemStyle = [
    styles.item,
    styles[`item_${size}`],
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.textDisabled,
  ];

  const descriptionStyle = [
    styles.description,
    styles[`description_${size}`],
    disabled && styles.descriptionDisabled,
  ];

  const renderItem = ({ item }: { item: ListItem }) => (
    <View style={itemStyle} accessibilityRole="text" accessibilityLabel={item.label}>
      <Text style={textStyle}>{item.label}</Text>
      {item.description && <Text style={descriptionStyle}>{item.description}</Text>}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={containerStyle}
      scrollEnabled={!disabled}
      accessibilityRole="list"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
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
  containerDisabled: {
    opacity: 0.5,
  },
  item: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  item_sm: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  item_md: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item_lg: {
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  text: {
    fontWeight: '600',
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
    color: '#1F2937',
  },
  text_danger: {
    color: '#FFFFFF',
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
  textDisabled: {
    color: '#9CA3AF',
  },
  description: {
    marginTop: 4,
    opacity: 0.8,
  },
  description_sm: {
    fontSize: 12,
  },
  description_md: {
    fontSize: 14,
  },
  description_lg: {
    fontSize: 16,
  },
  descriptionDisabled: {
    color: '#9CA3AF',
  },
});

export { List };
export default memo(List);
