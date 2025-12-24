import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    wateringReminders: true,
    fertilizingReminders: true,
    pruningReminders: true,
    repottingAlerts: false,
    plantHealthTips: true,
    seasonalAdvice: true,
    weeklyDigest: false,
    newFeatures: true,
  });

  const [reminderTime, setReminderTime] = useState('09:00');

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const timeOptions = ['07:00', '08:00', '09:00', '10:00', '12:00', '18:00', '20:00'];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>

          <View style={styles.optionCard}>
            <View style={styles.option}>
              <Ionicons name="notifications-outline" size={24} color="#22C55E" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Enable Notifications</Text>
                <Text style={styles.optionDescription}>Receive push notifications for your plants</Text>
              </View>
              <Switch
                value={settings.pushEnabled}
                onValueChange={() => toggleSetting('pushEnabled')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.pushEnabled ? '#22C55E' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Reminders</Text>

          <View style={styles.optionCard}>
            <View style={styles.option}>
              <Ionicons name="water-outline" size={24} color="#3B82F6" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Watering Reminders</Text>
                <Text style={styles.optionDescription}>Get notified when plants need water</Text>
              </View>
              <Switch
                value={settings.wateringReminders}
                onValueChange={() => toggleSetting('wateringReminders')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.wateringReminders ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={styles.option}>
              <Ionicons name="flask-outline" size={24} color="#8B5CF6" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Fertilizing Reminders</Text>
                <Text style={styles.optionDescription}>Alerts for fertilizer schedules</Text>
              </View>
              <Switch
                value={settings.fertilizingReminders}
                onValueChange={() => toggleSetting('fertilizingReminders')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.fertilizingReminders ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={styles.option}>
              <Ionicons name="cut-outline" size={24} color="#F59E0B" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Pruning Reminders</Text>
                <Text style={styles.optionDescription}>When your plants need trimming</Text>
              </View>
              <Switch
                value={settings.pruningReminders}
                onValueChange={() => toggleSetting('pruningReminders')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.pruningReminders ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={[styles.option, styles.optionLast]}>
              <Ionicons name="flower-outline" size={24} color="#EC4899" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Repotting Alerts</Text>
                <Text style={styles.optionDescription}>Yearly repotting suggestions</Text>
              </View>
              <Switch
                value={settings.repottingAlerts}
                onValueChange={() => toggleSetting('repottingAlerts')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.repottingAlerts ? '#22C55E' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Time</Text>
          <Text style={styles.sectionSubtitle}>When should we send daily reminders?</Text>

          <View style={styles.timeOptions}>
            {timeOptions.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  reminderTime === time && styles.timeOptionSelected,
                ]}
                onPress={() => setReminderTime(time)}
              >
                <Text
                  style={[
                    styles.timeOptionText,
                    reminderTime === time && styles.timeOptionTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips & Updates</Text>

          <View style={styles.optionCard}>
            <View style={styles.option}>
              <Ionicons name="leaf-outline" size={24} color="#22C55E" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Plant Health Tips</Text>
                <Text style={styles.optionDescription}>Expert care advice for your plants</Text>
              </View>
              <Switch
                value={settings.plantHealthTips}
                onValueChange={() => toggleSetting('plantHealthTips')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.plantHealthTips ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={styles.option}>
              <Ionicons name="sunny-outline" size={24} color="#F59E0B" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Seasonal Advice</Text>
                <Text style={styles.optionDescription}>Tips based on current season</Text>
              </View>
              <Switch
                value={settings.seasonalAdvice}
                onValueChange={() => toggleSetting('seasonalAdvice')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.seasonalAdvice ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={styles.option}>
              <Ionicons name="newspaper-outline" size={24} color="#6366F1" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Weekly Digest</Text>
                <Text style={styles.optionDescription}>Summary of plant care activity</Text>
              </View>
              <Switch
                value={settings.weeklyDigest}
                onValueChange={() => toggleSetting('weeklyDigest')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.weeklyDigest ? '#22C55E' : '#9CA3AF'}
              />
            </View>

            <View style={[styles.option, styles.optionLast]}>
              <Ionicons name="sparkles-outline" size={24} color="#EC4899" />
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>New Features</Text>
                <Text style={styles.optionDescription}>Updates about new app features</Text>
              </View>
              <Switch
                value={settings.newFeatures}
                onValueChange={() => toggleSetting('newFeatures')}
                trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
                thumbColor={settings.newFeatures ? '#22C55E' : '#9CA3AF'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FDF4',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    marginLeft: 4,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: 72,
  },
  optionLast: {
    borderBottomWidth: 0,
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  timeOptionSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#DCFCE7',
  },
  timeOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  timeOptionTextSelected: {
    color: '#166534',
  },
});
