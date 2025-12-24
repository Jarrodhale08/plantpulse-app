import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { FREE_TIER_LIMITS, getRemainingPlants } from '../../src/config/premiumFeatures';

interface Plant {
  id: string;
  name: string;
  species: string;
  lastWatered: string;
  healthStatus: 'healthy' | 'needs-attention' | 'critical';
  wateringFrequency: number;
  location: string;
}

interface HomeData {
  plants: Plant[];
  totalPlants: number;
  healthyPlants: number;
  needsAttention: number;
}

export default function Screen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [homeData, setHomeData] = useState<HomeData>({
    plants: [],
    totalPlants: 0,
    healthyPlants: 0,
    needsAttention: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { isPremium } = useSubscriptionStore();

  // Calculate remaining plants for free users
  const remainingPlants = getRemainingPlants(homeData.totalPlants, isPremium);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 500));
      setHomeData({
        plants: [],
        totalPlants: 0,
        healthyPlants: 0,
        needsAttention: 0,
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load plant data');
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCardPress = (plantId?: string) => {
    router.push('/details');
  };

  const getHealthColor = (status: Plant['healthStatus']) => {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setLoading(true);
              loadData();
            }}
            accessibilityLabel="Retry loading data"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>PlantPulse</Text>
        <Text style={styles.headerSubtitle}>Your Plant Care Companion</Text>
      </View>
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#F59E0B"
          />
        }
      >
        {/* Premium Banner for Free Users */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => router.push('/subscription')}
            accessibilityLabel="Upgrade to Premium"
            accessibilityRole="button"
          >
            <Ionicons name="star" size={24} color="#F59E0B" />
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>Upgrade to Pro</Text>
              <Text style={styles.premiumSubtitle}>
                {typeof remainingPlants === 'number' && remainingPlants > 0
                  ? `${remainingPlants} free plants remaining`
                  : `${homeData.totalPlants}/${FREE_TIER_LIMITS.maxPlants} plants used`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#F59E0B" />
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{homeData.totalPlants}</Text>
            <Text style={styles.statLabel}>Total Plants</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{homeData.healthyPlants}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{homeData.needsAttention}</Text>
            <Text style={styles.statLabel}>Needs Care</Text>
          </View>
        </View>

        {homeData.plants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="leaf-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No Plants Yet</Text>
            <Text style={styles.emptyText}>Add your first plant to start tracking its care</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/details')}
              accessibilityLabel="Add your first plant"
              accessibilityRole="button"
            >
              <Ionicons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Plant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.plantsSection}>
            <Text style={styles.sectionTitle}>My Plants</Text>
            {homeData.plants.map((plant) => (
              <TouchableOpacity
                key={plant.id}
                style={styles.card}
                onPress={() => handleCardPress(plant.id)}
                accessibilityLabel={`View details for ${plant.name}`}
                accessibilityRole="button"
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.plantName}>{plant.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getHealthColor(plant.healthStatus) }]}>
                      <Text style={styles.statusText}>
                        {plant.healthStatus === 'healthy' ? 'Healthy' : plant.healthStatus === 'needs-attention' ? 'Needs Care' : 'Critical'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.plantSpecies}>{plant.species}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                      <Ionicons name="water-outline" size={16} color="#6B7280" />
                      <Text style={styles.infoText}>Last watered: {plant.lastWatered}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <Text style={styles.infoText}>{plant.location}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: '#6B7280' },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  premiumBanner: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: '#B45309',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#F59E0B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, minHeight: 44 },
  retryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F59E0B', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, gap: 8, minHeight: 44 },
  addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  plantsSection: { paddingHorizontal: 16, paddingTop: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, minHeight: 44 },
  cardContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  plantName: { fontSize: 18, fontWeight: '600', color: '#111827', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  plantSpecies: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  cardFooter: { gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: '#6B7280' },
});
