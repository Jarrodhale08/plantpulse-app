import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UNITS_SETTINGS_KEY = 'plantpulse_units_settings';

interface UnitsSettings {
  waterVolume: 'cups' | 'ml' | 'oz';
  potSize: 'inches' | 'cm';
  temperature: 'fahrenheit' | 'celsius';
}

const unitOptions = {
  waterVolume: [
    { value: 'cups', label: 'Cups', description: '1 cup = 236ml' },
    { value: 'ml', label: 'Milliliters (ml)', description: 'Metric' },
    { value: 'oz', label: 'Fluid Ounces (oz)', description: '1 oz = 30ml' },
  ],
  potSize: [
    { value: 'inches', label: 'Inches (in)', description: 'US Standard' },
    { value: 'cm', label: 'Centimeters (cm)', description: 'Metric' },
  ],
  temperature: [
    { value: 'fahrenheit', label: 'Fahrenheit (°F)', description: 'US Standard' },
    { value: 'celsius', label: 'Celsius (°C)', description: 'Metric' },
  ],
};

export default function UnitsScreen() {
  const [settings, setSettings] = useState<UnitsSettings>({
    waterVolume: 'cups',
    potSize: 'inches',
    temperature: 'fahrenheit',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(UNITS_SETTINGS_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch { /* Use defaults */ }
  };

  const updateSetting = useCallback(async <K extends keyof UnitsSettings>(key: K, value: UnitsSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(UNITS_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch { /* Settings persist in memory */ }
  }, [settings]);

  const renderOptionGroup = (
    title: string,
    icon: string,
    settingKey: keyof UnitsSettings,
    options: Array<{ value: string; label: string; description: string }>
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon as any} size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.option}
          onPress={() => updateSetting(settingKey, option.value as any)}
        >
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>{option.label}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
          <View style={[styles.radio, settings[settingKey] === option.value && styles.radioSelected]}>
            {settings[settingKey] === option.value && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>
          Choose your preferred units for plant care measurements
        </Text>

        {renderOptionGroup('Water Volume', 'water-outline', 'waterVolume', unitOptions.waterVolume)}
        {renderOptionGroup('Pot Size', 'resize-outline', 'potSize', unitOptions.potSize)}
        {renderOptionGroup('Temperature', 'thermometer-outline', 'temperature', unitOptions.temperature)}

        <View style={styles.tipCard}>
          <Ionicons name="leaf" size={20} color="#10B981" />
          <Text style={styles.tipText}>
            These settings affect how watering recommendations and plant care tips are displayed throughout the app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 16 },
  headerText: { fontSize: 16, color: '#6B7280', marginBottom: 24, lineHeight: 22 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 8 },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  optionDescription: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { borderColor: '#10B981' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#10B981' },
  tipCard: { flexDirection: 'row', backgroundColor: '#ECFDF5', borderRadius: 12, padding: 16, gap: 12, alignItems: 'flex-start', marginBottom: 32 },
  tipText: { flex: 1, fontSize: 14, color: '#065F46', lineHeight: 20 },
});
