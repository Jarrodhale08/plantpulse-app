import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface PlantDetail {
  id: string;
  name: string;
  species: string;
  location: string;
  wateringFrequency: number;
  lastWatered: string;
  healthStatus: 'healthy' | 'needs-attention' | 'critical';
  notes?: string;
  lightRequirement?: 'low' | 'medium' | 'high';
  potSize?: string;
}

export default function PlantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadPlantData = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API call - Replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock data - Replace with actual data from database
      setPlant({
        id: id || '1',
        name: 'Monstera Deliciosa',
        species: 'Monstera deliciosa',
        location: 'Living Room',
        wateringFrequency: 7,
        lastWatered: '3 days ago',
        healthStatus: 'healthy',
        notes: 'Growing well with new leaves appearing',
        lightRequirement: 'medium',
        potSize: '12 inches',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load plant details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPlantData();
    setRefreshing(false);
  }, [loadPlantData]);

  useEffect(() => {
    loadPlantData();
  }, [loadPlantData]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Plant',
      'Are you sure you want to delete this plant? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from database
              // await deletePlant(id);
              router.back();
              Alert.alert('Success', 'Plant deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plant');
            }
          },
        },
      ]
    );
  };

  const handleWater = async () => {
    Alert.alert(
      'Water Plant',
      'Mark this plant as watered today?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Water',
          onPress: async () => {
            try {
              // Update last watered date
              setPlant(prev => prev ? { ...prev, lastWatered: 'Today' } : null);
              Alert.alert('Success', 'Plant watered successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to update watering status');
            }
          },
        },
      ]
    );
  };

  const getHealthColor = (status: PlantDetail['healthStatus']) => {
    switch (status) {
      case 'healthy':
        return '#10B981';
      case 'needs-attention':
        return '#F59E0B';
      case 'critical':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getHealthLabel = (status: PlantDetail['healthStatus']) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'needs-attention':
        return 'Needs Attention';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  const getLightLabel = (light?: string) => {
    switch (light) {
      case 'low':
        return 'Low Light';
      case 'medium':
        return 'Medium Light';
      case 'high':
        return 'Bright Light';
      default:
        return 'Not specified';
    }
  };

  if (loading && !plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Plant not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Details</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
          />
        }
      >
        <View style={styles.plantCard}>
          <View style={styles.plantHeader}>
            <View style={styles.plantIcon}>
              <Ionicons name="leaf" size={48} color="#10B981" />
            </View>
            <View style={styles.plantInfo}>
              <Text style={styles.plantName}>{plant.name}</Text>
              <Text style={styles.plantSpecies}>{plant.species}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getHealthColor(plant.healthStatus) }]}>
                <Text style={styles.statusText}>{getHealthLabel(plant.healthStatus)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="water" size={24} color="#3B82F6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Watering Schedule</Text>
                <Text style={styles.infoValue}>Every {plant.wateringFrequency} days</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={24} color="#8B5CF6" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Last Watered</Text>
                <Text style={styles.infoValue}>{plant.lastWatered}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={24} color="#F59E0B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{plant.location}</Text>
              </View>
            </View>
          </View>

          {plant.lightRequirement && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="sunny" size={24} color="#F59E0B" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Light Requirement</Text>
                  <Text style={styles.infoValue}>{getLightLabel(plant.lightRequirement)}</Text>
                </View>
              </View>
            </View>
          )}

          {plant.potSize && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="flower" size={24} color="#EC4899" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Pot Size</Text>
                  <Text style={styles.infoValue}>{plant.potSize}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {plant.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{plant.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.waterButton}
          onPress={handleWater}
          accessibilityLabel="Mark as watered"
          accessibilityRole="button"
        >
          <Ionicons name="water" size={24} color="#FFFFFF" />
          <Text style={styles.waterButtonText}>Water Plant</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  plantCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  plantIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  plantSpecies: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  notesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  waterButton: {
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
  waterButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
