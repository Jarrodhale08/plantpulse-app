import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FREE_TIER_LIMITS, isPlantLimitReached } from '../../src/config/premiumFeatures';

// This would normally come from subscription store
const MOCK_SUBSCRIPTION = {
  isPremium: false,
};

// This would normally come from plant store
const MOCK_PLANTS_COUNT = 8;

export default function AddPlantScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [location, setLocation] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [lightRequirement, setLightRequirement] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  // Check limit on mount
  useEffect(() => {
    const limitReached = isPlantLimitReached(MOCK_PLANTS_COUNT, MOCK_SUBSCRIPTION.isPremium);

    if (limitReached) {
      Alert.alert(
        'Upgrade Required',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxPlants} plants. Upgrade to Pro for unlimited plants!`,
        [
          { text: 'Maybe Later', onPress: () => router.back() },
          { text: 'Upgrade Now', onPress: () => router.replace('/subscription') },
        ]
      );
    }
  }, [router]);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a plant name');
      return false;
    }

    if (!species.trim()) {
      Alert.alert('Validation Error', 'Please enter the plant species');
      return false;
    }

    if (!location.trim()) {
      Alert.alert('Validation Error', 'Please enter the plant location');
      return false;
    }

    const frequency = parseInt(wateringFrequency);
    if (isNaN(frequency) || frequency < 1 || frequency > 365) {
      Alert.alert('Validation Error', 'Watering frequency must be between 1 and 365 days');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Check limit before saving
    const limitReached = isPlantLimitReached(MOCK_PLANTS_COUNT, MOCK_SUBSCRIPTION.isPremium);
    if (limitReached) {
      Alert.alert(
        'Upgrade Required',
        `You've reached the free tier limit of ${FREE_TIER_LIMITS.maxPlants} plants. Upgrade to Pro for unlimited plants!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade Now', onPress: () => router.replace('/subscription') },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      // Save to database
      const plantData = {
        name: name.trim(),
        species: species.trim(),
        location: location.trim(),
        wateringFrequency: parseInt(wateringFrequency),
        lightRequirement,
        notes: notes.trim(),
        lastWatered: new Date().toISOString(),
        healthStatus: 'healthy',
      };

      // Simulate API call - Replace with actual Supabase insert
      await new Promise(resolve => setTimeout(resolve, 1000));

      Alert.alert('Success', 'Plant added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Plant</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Plant Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Monstera Deliciosa"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Species *</Text>
            <TextInput
              style={styles.input}
              value={species}
              onChangeText={setSpecies}
              placeholder="e.g., Monstera deliciosa"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="e.g., Living Room"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Watering Frequency (days) *</Text>
            <TextInput
              style={styles.input}
              value={wateringFrequency}
              onChangeText={setWateringFrequency}
              placeholder="7"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
            />
            <Text style={styles.helpText}>How often should this plant be watered?</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Light Requirement</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  lightRequirement === 'low' && styles.optionButtonActive,
                ]}
                onPress={() => setLightRequirement('low')}
              >
                <Ionicons
                  name="moon"
                  size={20}
                  color={lightRequirement === 'low' ? '#FFFFFF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.optionText,
                    lightRequirement === 'low' && styles.optionTextActive,
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  lightRequirement === 'medium' && styles.optionButtonActive,
                ]}
                onPress={() => setLightRequirement('medium')}
              >
                <Ionicons
                  name="cloudy"
                  size={20}
                  color={lightRequirement === 'medium' ? '#FFFFFF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.optionText,
                    lightRequirement === 'medium' && styles.optionTextActive,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  lightRequirement === 'high' && styles.optionButtonActive,
                ]}
                onPress={() => setLightRequirement('high')}
              >
                <Ionicons
                  name="sunny"
                  size={20}
                  color={lightRequirement === 'high' ? '#FFFFFF' : '#6B7280'}
                />
                <Text
                  style={[
                    styles.optionText,
                    lightRequirement === 'high' && styles.optionTextActive,
                  ]}
                >
                  High
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes about this plant..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          accessibilityLabel="Save plant"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Plant</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    minHeight: 44,
  },
  optionButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
