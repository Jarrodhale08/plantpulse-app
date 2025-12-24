import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const [goals, setGoals] = useState({
    totalPlants: '10',
    weeklyWatering: '15',
    monthlyNewPlants: '2',
    yearlyMastered: '5',
  });

  const [careStreak, setCareStreak] = useState(7);

  const handleSave = useCallback(() => {
    Keyboard.dismiss();
    Alert.alert('Goals Updated', 'Your plant care goals have been saved!');
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>
            Set goals to grow your plant collection and become a better plant parent.
          </Text>

          {/* Current Streak */}
          <View style={styles.streakCard}>
            <View style={styles.streakIcon}>
              <Ionicons name="flame" size={32} color="#F59E0B" />
            </View>
            <View style={styles.streakContent}>
              <Text style={styles.streakLabel}>Current Care Streak</Text>
              <Text style={styles.streakValue}>{careStreak} days</Text>
            </View>
            <Ionicons name="trophy" size={28} color="#F59E0B" />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Collection Goals</Text>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIconContainer}>
                  <Ionicons name="leaf" size={24} color="#22C55E" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Plant Collection</Text>
                  <Text style={styles.goalHint}>How many plants do you want to own?</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={goals.totalPlants}
                  onChangeText={(text) =>
                    setGoals({ ...goals, totalPlants: text.replace(/[^0-9]/g, '') })
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                  placeholder="10"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputUnit}>plants</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>6 of {goals.totalPlants} plants</Text>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIconContainer, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="water" size={24} color="#3B82F6" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Weekly Watering</Text>
                  <Text style={styles.goalHint}>Target watering sessions per week</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={goals.weeklyWatering}
                  onChangeText={(text) =>
                    setGoals({ ...goals, weeklyWatering: text.replace(/[^0-9]/g, '') })
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="15"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputUnit}>times/week</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '80%', backgroundColor: '#3B82F6' }]} />
              </View>
              <Text style={styles.progressText}>12 of {goals.weeklyWatering} this week</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth Goals</Text>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIconContainer, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="add-circle" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>New Plants Monthly</Text>
                  <Text style={styles.goalHint}>Plants to add each month</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={goals.monthlyNewPlants}
                  onChangeText={(text) =>
                    setGoals({ ...goals, monthlyNewPlants: text.replace(/[^0-9]/g, '') })
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="2"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputUnit}>plants/month</Text>
              </View>
            </View>

            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <View style={[styles.goalIconContainer, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="ribbon" size={24} color="#F59E0B" />
                </View>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalTitle}>Species to Master</Text>
                  <Text style={styles.goalHint}>Plant types to learn this year</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={goals.yearlyMastered}
                  onChangeText={(text) =>
                    setGoals({ ...goals, yearlyMastered: text.replace(/[^0-9]/g, '') })
                  }
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="5"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={styles.inputUnit}>species/year</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="bulb-outline" size={24} color="#22C55E" />
            <Text style={styles.tipText}>
              Start small! It's better to care well for a few plants than struggle with many.
            </Text>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Goals</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  header: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 24,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  streakIcon: {
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 14,
    color: '#92400E',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#78350F',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  goalHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    minHeight: 50,
    width: 80,
    textAlign: 'center',
  },
  inputUnit: {
    fontSize: 15,
    color: '#6B7280',
    marginLeft: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginTop: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#DCFCE7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22C55E',
    borderRadius: 12,
    padding: 16,
    gap: 8,
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
