import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  isPremium: boolean;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 1,
    icon: 'leaf-outline',
    title: 'Track Your Plants',
    description: 'Keep detailed records of all your plants in one place. Monitor their health and care schedule effortlessly.',
    isPremium: false,
  },
  {
    id: 2,
    icon: 'water-outline',
    title: 'Smart Watering Reminders',
    description: 'Never forget to water your plants again. Get timely notifications based on each plant\'s unique needs.',
    isPremium: true,
  },
  {
    id: 3,
    icon: 'camera-outline',
    title: 'Plant Identification',
    description: 'Identify plants instantly with AI-powered photo recognition. Learn about care requirements for any plant.',
    isPremium: true,
  },
  {
    id: 4,
    icon: 'stats-chart-outline',
    title: 'Growth Analytics',
    description: 'Track your plant collection growth over time. Get insights into watering patterns and plant health trends.',
    isPremium: true,
  },
  {
    id: 5,
    icon: 'cloud-upload-outline',
    title: 'Cloud Sync',
    description: 'Access your plant collection across all devices. Never lose your data with automatic cloud backup.',
    isPremium: true,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const scrollToNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentIndex + 1),
        animated: true,
      });
    }
  };

  const handleStartTrial = async () => {
    // Mark onboarding as complete
    await AsyncStorage.setItem('plantpulse_onboarding_complete', 'true');

    // Navigate to subscription screen for trial
    router.replace('/subscription');
  };

  const handleContinueFree = async () => {
    // Mark onboarding as complete
    await AsyncStorage.setItem('plantpulse_onboarding_complete', 'true');

    // Navigate to main app
    router.replace('/(tabs)');
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>PlantPulse</Text>
        <TouchableOpacity onPress={handleContinueFree} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <View style={styles.iconContainer}>
              {slide.isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.premiumText}>PREMIUM</Text>
                </View>
              )}
              <View style={styles.iconCircle}>
                <Ionicons name={slide.icon} size={64} color="#10B981" />
              </View>
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {ONBOARDING_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {isLastSlide ? (
          <>
            <TouchableOpacity
              style={styles.trialButton}
              onPress={handleStartTrial}
              accessibilityLabel="Start 7-day free trial"
              accessibilityRole="button"
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
              <Text style={styles.trialButtonText}>Start 7-Day Free Trial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueFree}
              accessibilityLabel="Continue with free version"
              accessibilityRole="button"
            >
              <Text style={styles.continueButtonText}>Continue Free</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={scrollToNext}
            accessibilityLabel="Next slide"
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 1,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F59E0B',
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: '#10B981',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  trialButton: {
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
  trialButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  continueButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
