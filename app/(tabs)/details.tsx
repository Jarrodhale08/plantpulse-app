import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import useAppStore from '../../src/stores/appStore';
import { identifyPlant, getDisplayName, formatConfidence, preloadModel } from '../../src/services/plantIdentification.service';
import type { PlantIdentificationResult } from '../../src/services/plantIdentification.service';

export default function PlantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { pets: plants, addPet: addPlant, updatePet: updatePlant, removePet: removePlant } = useAppStore();

  const isEditMode = !!id;
  const existingPlant = isEditMode ? plants.find(p => p.id === id) : null;

  const [name, setName] = useState(existingPlant?.name || '');
  const [species, setSpecies] = useState(existingPlant?.species || '');
  const [location, setLocation] = useState(existingPlant?.breed || '');
  const [wateringFrequency, setWateringFrequency] = useState(
    existingPlant?.weight?.toString() || '7'
  );
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(existingPlant?.photoUri);
  const [isSaving, setIsSaving] = useState(false);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identificationResult, setIdentificationResult] = useState<PlantIdentificationResult | null>(null);

  const speciesRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const wateringRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  // Preload the ML model for faster identification
  useEffect(() => {
    preloadModel();
  }, []);

  const handleIdentifyPlant = useCallback(async (imageUri: string) => {
    setIsIdentifying(true);
    setIdentificationResult(null);
    try {
      const result = await identifyPlant(imageUri);
      if (result.success && result.bestMatch) {
        setIdentificationResult(result.bestMatch);
        const displayName = getDisplayName(result.bestMatch);
        setSpecies(displayName);
        if (!name.trim()) {
          setName(displayName);
        }
        const confidenceStr = formatConfidence(result.bestMatch.confidence);
        Alert.alert(
          'Plant Identified!',
          `We identified this as:\n\n${displayName}\n\nConfidence: ${confidenceStr}${result.bestMatch.isPlant ? '' : '\n\n(This may not be a plant)'}`,
          [
            { text: 'Use This', onPress: () => {} },
            { text: 'Clear', style: 'cancel', onPress: () => { setSpecies(''); setIdentificationResult(null); } },
          ]
        );
      } else if (result.error) {
        Alert.alert('Identification Failed', result.error);
      } else {
        Alert.alert('No Match Found', 'We could not identify the plant in this image. Try a clearer photo with good lighting.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to identify plant. Please try again.');
    } finally {
      setIsIdentifying(false);
    }
  }, [name]);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add plant photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      Alert.alert(
        'Identify Plant?',
        'Would you like us to automatically identify this plant? (Works offline!)',
        [
          { text: 'No Thanks', style: 'cancel' },
          { text: 'Identify', onPress: () => handleIdentifyPlant(uri) },
        ]
      );
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'Please allow access to your camera to take plant photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      Alert.alert(
        'Identify Plant?',
        'Would you like us to automatically identify this plant? (Works offline!)',
        [
          { text: 'No Thanks', style: 'cancel' },
          { text: 'Identify', onPress: () => handleIdentifyPlant(uri) },
        ]
      );
    }
  };

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a name for your plant.');
      return;
    }
    if (!species.trim()) {
      Alert.alert('Missing Information', 'Please enter the plant species.');
      return;
    }
    setIsSaving(true);
    Keyboard.dismiss();
    try {
      const plantData = {
        id: isEditMode ? id! : `plant_${Date.now()}`,
        name: name.trim(),
        species: species.trim(),
        breed: location.trim(),
        dateOfBirth: existingPlant?.dateOfBirth || new Date().toISOString(),
        photoUri,
        weight: parseInt(wateringFrequency) || 7,
        gender: 'male' as const,
      };
      if (isEditMode) {
        updatePlant(id!, plantData);
        Alert.alert('Success', 'Plant updated successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        addPlant(plantData);
        Alert.alert('Success', 'Plant added successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch {
      Alert.alert('Error', 'Failed to save plant. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [name, species, location, wateringFrequency, photoUri, isEditMode, id, existingPlant?.dateOfBirth, updatePlant, addPlant, router]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Plant',
      `Are you sure you want to remove "${name}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { removePlant(id!); router.back(); } },
      ]
    );
  }, [id, name, removePlant, router]);

  const handleWaterNow = useCallback(() => {
    if (isEditMode && id) {
      updatePlant(id, { dateOfBirth: new Date().toISOString() });
      Alert.alert('Watered!', `${name} has been watered. Great job caring for your plant!`);
    }
  }, [id, name, isEditMode, updatePlant]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.title}>{isEditMode ? 'Edit Plant' : 'Add New Plant'}</Text>
              <Text style={styles.subtitle}>{isEditMode ? 'Update your plant details below' : "Take a photo and we'll identify your plant! (Works offline)"}</Text>
            </View>

            <View style={styles.photoSection}>
              {photoUri ? (
                <TouchableOpacity onPress={handlePickImage} disabled={isIdentifying}>
                  <Image source={{ uri: photoUri }} style={styles.plantPhoto} />
                  {isIdentifying ? (
                    <View style={styles.photoOverlayLoading}>
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.photoOverlay}>
                      <Ionicons name="camera" size={24} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="leaf" size={48} color="#10B981" />
                </View>
              )}
              <View style={styles.photoButtons}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto} disabled={isIdentifying}>
                  <Ionicons name="camera-outline" size={20} color="#10B981" />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handlePickImage} disabled={isIdentifying}>
                  <Ionicons name="images-outline" size={20} color="#10B981" />
                  <Text style={styles.photoButtonText}>Choose Photo</Text>
                </TouchableOpacity>
              </View>
              {photoUri && !isIdentifying && (
                <TouchableOpacity style={styles.identifyButton} onPress={() => handleIdentifyPlant(photoUri)}>
                  <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.identifyButtonText}>Identify Plant</Text>
                </TouchableOpacity>
              )}
              {isIdentifying && (
                <View style={styles.identifyingContainer}>
                  <ActivityIndicator size="small" color="#10B981" />
                  <Text style={styles.identifyingText}>Identifying plant...</Text>
                </View>
              )}
            </View>

            {identificationResult && (
              <View style={styles.identificationCard}>
                <View style={styles.identificationHeader}>
                  <Ionicons name="leaf" size={20} color="#10B981" />
                  <Text style={styles.identificationTitle}>Plant Identified</Text>
                  <View style={styles.offlineBadge}>
                    <Ionicons name="cloud-offline-outline" size={12} color="#065F46" />
                    <Text style={styles.offlineBadgeText}>Offline</Text>
                  </View>
                </View>
                <Text style={styles.identificationName}>{getDisplayName(identificationResult)}</Text>
                <View style={styles.identificationDetails}>
                  <View style={styles.identificationDetail}>
                    <Text style={styles.identificationLabel}>Confidence</Text>
                    <Text style={styles.identificationValue}>{formatConfidence(identificationResult.confidence)}</Text>
                  </View>
                  <View style={styles.identificationDetail}>
                    <Text style={styles.identificationLabel}>Type</Text>
                    <Text style={styles.identificationValue}>{identificationResult.isPlant ? 'Plant' : 'Unknown'}</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Plant Name *</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g., Fern, Monstera, Spider Plant" placeholderTextColor="#9CA3AF" returnKeyType="next" onSubmitEditing={() => speciesRef.current?.focus()} blurOnSubmit={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Species *</Text>
                <TextInput ref={speciesRef} style={styles.input} value={species} onChangeText={setSpecies} placeholder="e.g., Boston Fern, Monstera Deliciosa" placeholderTextColor="#9CA3AF" returnKeyType="next" onSubmitEditing={() => locationRef.current?.focus()} blurOnSubmit={false} />
                {identificationResult && (
                  <Text style={styles.helperText}>Auto-filled from plant identification</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput ref={locationRef} style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g., Living Room, Kitchen Window" placeholderTextColor="#9CA3AF" returnKeyType="next" onSubmitEditing={() => wateringRef.current?.focus()} blurOnSubmit={false} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Watering Frequency (days)</Text>
                <View style={styles.inputRow}>
                  <TextInput ref={wateringRef} style={[styles.input, styles.numberInput]} value={wateringFrequency} onChangeText={setWateringFrequency} placeholder="7" placeholderTextColor="#9CA3AF" keyboardType="number-pad" returnKeyType="done" />
                  <TouchableOpacity style={styles.doneButton} onPress={() => { Keyboard.dismiss(); notesRef.current?.focus(); }}>
                    <Ionicons name="checkmark-circle" size={28} color="#10B981" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>We'll remind you to water every {wateringFrequency || '7'} days</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes</Text>
                <TextInput ref={notesRef} style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} placeholder="Add any care notes, fertilizing schedule, or observations..." placeholderTextColor="#9CA3AF" multiline numberOfLines={4} textAlignVertical="top" />
              </View>
            </View>

            {isEditMode && (
              <TouchableOpacity style={styles.waterButton} onPress={handleWaterNow}>
                <Ionicons name="water" size={24} color="#FFFFFF" />
                <Text style={styles.waterButtonText}>Water Now</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving}>
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Plant')}</Text>
            </TouchableOpacity>

            {isEditMode && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.deleteButtonText}>Delete Plant</Text>
              </TouchableOpacity>
            )}

            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
                <Text style={styles.tipsTitle}>Care Tips</Text>
              </View>
              <Text style={styles.tipsText}>• Check soil moisture before watering - stick your finger 1 inch into the soil</Text>
              <Text style={styles.tipsText}>• Most houseplants prefer indirect sunlight</Text>
              <Text style={styles.tipsText}>• Yellow leaves often indicate overwatering</Text>
              <Text style={styles.tipsText}>• Brown leaf tips may mean low humidity</Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  photoSection: { alignItems: 'center', marginBottom: 24 },
  plantPhoto: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E5E7EB' },
  photoOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#10B981', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  photoOverlayLoading: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#6B7280', width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFFFFF' },
  photoPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  photoButtons: { flexDirection: 'row', gap: 16, marginTop: 12 },
  photoButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#ECFDF5', borderRadius: 8 },
  photoButtonText: { fontSize: 14, fontWeight: '600', color: '#10B981' },
  identifyButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#10B981', borderRadius: 8, marginTop: 12 },
  identifyButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  identifyingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  identifyingText: { fontSize: 14, color: '#10B981' },
  identificationCard: { backgroundColor: '#ECFDF5', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#A7F3D0' },
  identificationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  identificationTitle: { fontSize: 14, fontWeight: '600', color: '#065F46', flex: 1 },
  offlineBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  offlineBadgeText: { fontSize: 10, fontWeight: '600', color: '#065F46' },
  identificationName: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12 },
  identificationDetails: { flexDirection: 'row', gap: 24 },
  identificationDetail: { flex: 1 },
  identificationLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  identificationValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  form: { gap: 20, marginBottom: 24 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginLeft: 4 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#111827', minHeight: 50 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numberInput: { flex: 1 },
  doneButton: { padding: 8, minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  textArea: { minHeight: 100, paddingTop: 14 },
  helperText: { fontSize: 12, color: '#6B7280', marginLeft: 4, marginTop: 4 },
  waterButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B82F6', borderRadius: 12, padding: 16, marginBottom: 12, gap: 8 },
  waterButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981', borderRadius: 12, padding: 16, marginBottom: 12, gap: 8 },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2', borderRadius: 12, padding: 14, marginBottom: 24, gap: 8, borderWidth: 1, borderColor: '#FECACA' },
  deleteButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  tipsCard: { backgroundColor: '#FFFBEB', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#FDE68A' },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  tipsTitle: { fontSize: 16, fontWeight: '700', color: '#92400E' },
  tipsText: { fontSize: 14, color: '#78350F', lineHeight: 22, marginBottom: 4 },
});
