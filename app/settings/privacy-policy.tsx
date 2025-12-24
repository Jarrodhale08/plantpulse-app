import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const LAST_UPDATED = 'December 24, 2024';
const COMPANY_NAME = 'PlantPulse';
const CONTACT_EMAIL = 'privacy@plantpulse.app';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${CONTACT_EMAIL}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)/settings')}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: {LAST_UPDATED}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} ("we", "our", or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.subTitle}>Account Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Email address</Text>
            <Text style={styles.bulletItem}>• Name and profile picture</Text>
          </View>

          <Text style={styles.subTitle}>Plant Data</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Plant photos you upload</Text>
            <Text style={styles.bulletItem}>• Plant names and care notes</Text>
            <Text style={styles.bulletItem}>• Watering and care schedules</Text>
            <Text style={styles.bulletItem}>• Plant health observations</Text>
          </View>

          <Text style={styles.subTitle}>Usage Data</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Device type and operating system</Text>
            <Text style={styles.bulletItem}>• App usage patterns</Text>
            <Text style={styles.bulletItem}>• Crash reports</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Identify plants from your photos</Text>
            <Text style={styles.bulletItem}>• Provide personalized care recommendations</Text>
            <Text style={styles.bulletItem}>• Send watering and care reminders</Text>
            <Text style={styles.bulletItem}>• Sync your plant collection across devices</Text>
            <Text style={styles.bulletItem}>• Improve our plant identification AI</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo Processing</Text>
          <Text style={styles.paragraph}>
            Plant photos you submit are processed to identify plant species and diagnose
            issues. Photos may be used to train and improve our identification algorithms.
            You can opt out of this in settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage and Security</Text>
          <Text style={styles.paragraph}>
            Your data is stored securely using Supabase with Row Level Security (RLS) policies.
            We use industry-standard encryption to protect your information in transit and at rest.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Supabase - Database and authentication</Text>
            <Text style={styles.bulletItem}>• RevenueCat - Subscription management</Text>
            <Text style={styles.bulletItem}>• Expo - Push notifications</Text>
            <Text style={styles.bulletItem}>• Plant identification API - Species recognition</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Access your personal data</Text>
            <Text style={styles.bulletItem}>• Export your plant collection</Text>
            <Text style={styles.bulletItem}>• Delete your account and all data</Text>
            <Text style={styles.bulletItem}>• Opt-out of photo training use</Text>
            <Text style={styles.bulletItem}>• Opt-out of notifications</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            Questions about this Privacy Policy? Contact us at:
          </Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.link}>{CONTACT_EMAIL}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D97706',
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#78350F',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#78350F',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletItem: {
    fontSize: 15,
    color: '#78350F',
    lineHeight: 24,
    marginBottom: 4,
  },
  link: {
    fontSize: 15,
    color: '#F59E0B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
