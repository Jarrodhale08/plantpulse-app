import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAppStore from '../../src/stores/appStore';

const PRIVACY_SETTINGS_KEY = 'plantpulse_privacy_settings';

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  shareUsageData: boolean;
}

export default function PrivacyScreen() {
  const { pets: plants, reset } = useAppStore();
  const [settings, setSettings] = useState<PrivacySettings>({
    analytics: true,
    crashReports: true,
    shareUsageData: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem(PRIVACY_SETTINGS_KEY);
      if (saved) setSettings(JSON.parse(saved));
    } catch { /* Use defaults */ }
  };

  const toggleSetting = useCallback(async (key: keyof PrivacySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(PRIVACY_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch { /* Settings persist in memory */ }
  }, [settings]);

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      `This will permanently delete all ${plants.length} plants and your settings. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          reset();
          await AsyncStorage.clear();
          Alert.alert('Data Deleted', 'All your plant data has been deleted.');
        }},
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        plantCount: plants.length,
        plants: plants.map(p => ({ name: p.name, species: p.species, location: p.breed, wateringFrequency: p.weight, dateAdded: p.dateOfBirth })),
        settings,
      };
      await Share.share({ message: JSON.stringify(exportData, null, 2), title: 'PlantPulse Data Export' });
    } catch {
      Alert.alert('Export Failed', 'Unable to export your data. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>

          <View style={styles.option}>
            <Ionicons name="analytics-outline" size={24} color="#10B981" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Analytics</Text>
              <Text style={styles.optionDescription}>Help improve the app with usage data</Text>
            </View>
            <Switch
              value={settings.analytics}
              onValueChange={() => toggleSetting('analytics')}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
              thumbColor={settings.analytics ? '#10B981' : '#9CA3AF'}
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="bug-outline" size={24} color="#10B981" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Crash Reports</Text>
              <Text style={styles.optionDescription}>Send crash reports to fix bugs</Text>
            </View>
            <Switch
              value={settings.crashReports}
              onValueChange={() => toggleSetting('crashReports')}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
              thumbColor={settings.crashReports ? '#10B981' : '#9CA3AF'}
            />
          </View>

          <View style={styles.option}>
            <Ionicons name="share-social-outline" size={24} color="#10B981" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Share Usage Data</Text>
              <Text style={styles.optionDescription}>Help us improve plant care recommendations</Text>
            </View>
            <Switch
              value={settings.shareUsageData}
              onValueChange={() => toggleSetting('shareUsageData')}
              trackColor={{ false: '#E5E7EB', true: '#A7F3D0' }}
              thumbColor={settings.shareUsageData ? '#10B981' : '#9CA3AF'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <Ionicons name="download-outline" size={24} color="#10B981" />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Export My Data</Text>
              <Text style={styles.optionDescription}>Share a copy of your plant data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleDeleteData}>
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: '#EF4444' }]}>Delete All Data</Text>
              <Text style={styles.optionDescription}>Permanently remove all plants</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.infoText}>
            Your plant data is stored locally on your device. We never share your personal information with third parties.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', minHeight: 72 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 8, minHeight: 72 },
  optionContent: { flex: 1, marginLeft: 12, marginRight: 12 },
  optionTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  optionDescription: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  infoCard: { flexDirection: 'row', backgroundColor: '#ECFDF5', borderRadius: 12, padding: 16, gap: 12, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 14, color: '#065F46', lineHeight: 20 },
});
