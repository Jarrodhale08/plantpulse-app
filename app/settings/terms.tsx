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
const CONTACT_EMAIL = 'legal@plantpulse.app';

export default function TermsScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: {LAST_UPDATED}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using the {COMPANY_NAME} mobile application ("App"),
            you agree to be bound by these Terms of Service ("Terms"). If you do not agree to
            these Terms, do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} is a plant care and identification application that helps users:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Identify plants using photo recognition</Text>
            <Text style={styles.bulletItem}>• Track watering schedules and care routines</Text>
            <Text style={styles.bulletItem}>• Diagnose plant health issues</Text>
            <Text style={styles.bulletItem}>• Receive personalized care reminders</Text>
            <Text style={styles.bulletItem}>• Build and manage your plant collection</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Plant Care Disclaimer</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} provides general plant care guidance for informational purposes only.
            Plant identification and care recommendations may not be 100% accurate. We are not
            responsible for plant health outcomes. For toxic plant identification or medical
            concerns, consult a professional.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Accounts</Text>
          <Text style={styles.paragraph}>
            To use certain features, you must create an account. You agree to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Provide accurate registration information</Text>
            <Text style={styles.bulletItem}>• Maintain the security of your credentials</Text>
            <Text style={styles.bulletItem}>• Notify us of any unauthorized access</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. User Content</Text>
          <Text style={styles.paragraph}>
            You retain ownership of plant photos and data you create. By submitting content,
            you grant us a license to store, process, and display it within the App for your use
            and to improve our plant identification algorithms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Subscriptions</Text>
          <Text style={styles.paragraph}>
            {COMPANY_NAME} offers premium features through auto-renewable subscriptions.
            Payment is charged through your App Store or Google Play account. Subscriptions
            renew automatically unless cancelled 24 hours before the renewal date.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Disclaimers</Text>
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE
            ACCURACY OF PLANT IDENTIFICATION OR CARE RECOMMENDATIONS. SOME PLANTS MAY BE
            TOXIC TO HUMANS OR PETS - ALWAYS VERIFY INDEPENDENTLY.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Open Source Software</Text>
          <Text style={styles.paragraph}>
            This App uses open source software licensed under the MIT License, including
            React Native, Expo, Supabase, Zustand, and other libraries. Full license terms
            are available at{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://opensource.org/licenses/MIT')}>
              opensource.org/licenses/MIT
            </Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            Questions about these Terms? Contact us at:
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
