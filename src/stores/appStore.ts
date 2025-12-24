import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface PetProfile {
  id: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  photoUri?: string;
  weight?: number;
  gender?: 'male' | 'female';
}

interface HealthRecord {
  id: string;
  petId: string;
  type: 'vet_visit' | 'medication' | 'vaccination' | 'other';
  title: string;
  description: string;
  date: string;
  veterinarian?: string;
  notes?: string;
}

interface Reminder {
  id: string;
  petId: string;
  type: 'medication' | 'appointment' | 'grooming' | 'other';
  title: string;
  description: string;
  dateTime: string;
  repeat?: 'daily' | 'weekly' | 'monthly' | 'none';
  isActive: boolean;
}

interface CareTip {
  id: string;
  species: string;
  category: string;
  title: string;
  content: string;
  imageUri?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  photoUri?: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  pets: PetProfile[];
  healthRecords: HealthRecord[];
  reminders: Reminder[];
  careTips: CareTip[];
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => Promise<void>;
  addPet: (pet: PetProfile) => void;
  updatePet: (id: string, pet: Partial<PetProfile>) => void;
  removePet: (id: string) => void;
  addHealthRecord: (record: HealthRecord) => void;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => void;
  removeHealthRecord: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  removeReminder: (id: string) => void;
  toggleReminderActive: (id: string) => void;
  setCareTips: (tips: CareTip[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  reset: () => void;
}

const saveToSecureStore = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.warn(`Failed to save ${key} to SecureStore:`, error);
  }
};

const loadFromSecureStore = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.warn(`Failed to load ${key} from SecureStore:`, error);
    return null;
  }
};

const deleteFromSecureStore = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.warn(`Failed to delete ${key} from SecureStore:`, error);
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  pets: [],
  healthRecords: [],
  reminders: [],
  careTips: [],
  loading: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: async (user) => {
        if (user) {
          await saveToSecureStore('user_data', JSON.stringify(user));
        } else {
          await deleteFromSecureStore('user_data');
        }
        set({ user, isAuthenticated: !!user });
      },

      addPet: (pet) => {
        set((state) => ({
          pets: [...state.pets, pet],
        }));
      },

      updatePet: (id, petUpdate) => {
        set((state) => ({
          pets: state.pets.map((pet) =>
            pet.id === id ? { ...pet, ...petUpdate } : pet
          ),
        }));
      },

      removePet: (id) => {
        set((state) => ({
          pets: state.pets.filter((pet) => pet.id !== id),
          healthRecords: state.healthRecords.filter((record) => record.petId !== id),
          reminders: state.reminders.filter((reminder) => reminder.petId !== id),
        }));
      },

      addHealthRecord: (record) => {
        set((state) => ({
          healthRecords: [...state.healthRecords, record],
        }));
      },

      updateHealthRecord: (id, recordUpdate) => {
        set((state) => ({
          healthRecords: state.healthRecords.map((record) =>
            record.id === id ? { ...record, ...recordUpdate } : record
          ),
        }));
      },

      removeHealthRecord: (id) => {
        set((state) => ({
          healthRecords: state.healthRecords.filter((record) => record.id !== id),
        }));
      },

      addReminder: (reminder) => {
        set((state) => ({
          reminders: [...state.reminders, reminder],
        }));
      },

      updateReminder: (id, reminderUpdate) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, ...reminderUpdate } : reminder
          ),
        }));
      },

      removeReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((reminder) => reminder.id !== id),
        }));
      },

      toggleReminderActive: (id) => {
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id ? { ...reminder, isActive: !reminder.isActive } : reminder
          ),
        }));
      },

      setCareTips: (tips) => set({ careTips: tips }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      logout: async () => {
        await deleteFromSecureStore('auth_token');
        await deleteFromSecureStore('user_data');
        set(initialState);
      },

      restoreSession: async () => {
        const token = await loadFromSecureStore('auth_token');
        const userData = await loadFromSecureStore('user_data');
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({ user, isAuthenticated: true });
          } catch (error) {
            console.warn('Failed to parse user data:', error);
          }
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'plantpulse-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pets: state.pets,
        healthRecords: state.healthRecords,
        reminders: state.reminders,
        careTips: state.careTips,
      }),
    }
  )
);

export default useAppStore;
