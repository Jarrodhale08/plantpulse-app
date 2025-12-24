import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Plant {
  id: string;
  name: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PlantState {
  plant: Plant | null;
  loading: boolean;
  error: string | null;
  fetchPlant: () => Promise<void>;
  updatePlant: (data: Partial<Plant>) => Promise<void>;
  clearPlant: () => void;
}

export const usePlantStore = create<PlantState>()(
  persist(
    (set, get) => ({
      plant: null,
      loading: false,
      error: null,

      fetchPlant: async () => {
        set({ loading: true, error: null });
        try {
          // Data is loaded from persisted storage automatically
          await new Promise(resolve => setTimeout(resolve, 100));
          set({ loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load plant',
            loading: false
          });
        }
      },

      updatePlant: async (data: Partial<Plant>) => {
        set({ loading: true, error: null });
        try {
          const currentPlant = get().plant;
          const updatedPlant: Plant = {
            id: data.id ?? currentPlant?.id ?? '1',
            name: data.name ?? currentPlant?.name ?? '',
            email: data.email ?? currentPlant?.email,
            createdAt: currentPlant?.createdAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set({ plant: updatedPlant, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update plant',
            loading: false
          });
        }
      },

      clearPlant: () => {
        set({ plant: null, loading: false, error: null });
      },
    }),
    {
      name: 'plant-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ plant: state.plant }),
    }
  )
);
