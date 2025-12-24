/**
 * Notification Store - PlantPulse
 *
 * Zustand store for notification settings and preferences.
 * Persists settings to AsyncStorage.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notificationService from '../services/notification.service';

// ============================================================================
// TYPES
// ============================================================================

export interface NotificationSettings {
  pushEnabled: boolean;
  wateringReminders: boolean;
  plantCare: boolean;
  achievements: boolean;
  weeklyReport: boolean;
  marketing: boolean;
  reminderTime: {
    hour: number;
    minute: number;
  };
  reminderDays: number[]; // 1-7 (1=Sunday, 7=Saturday)
}

interface NotificationState {
  // Settings
  settings: NotificationSettings;
  pushToken: string | null;
  permissionStatus: string;
  isInitialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  togglePushEnabled: () => Promise<void>;
  toggleWateringReminders: () => Promise<void>;
  togglePlantCare: () => Promise<void>;
  toggleAchievements: () => Promise<void>;
  toggleWeeklyReport: () => Promise<void>;
  toggleMarketing: () => Promise<void>;
  setReminderTime: (hour: number, minute: number) => Promise<void>;
  setReminderDays: (days: number[]) => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  scheduleNotifications: () => Promise<void>;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

const DEFAULT_SETTINGS: NotificationSettings = {
  pushEnabled: true,
  wateringReminders: true,
  plantCare: true,
  achievements: true,
  weeklyReport: false,
  marketing: false,
  reminderTime: {
    hour: 9,
    minute: 0,
  },
  reminderDays: [1, 2, 3, 4, 5, 6, 7], // All days
};

// ============================================================================
// STORE
// ============================================================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_SETTINGS,
      pushToken: null,
      permissionStatus: 'undetermined',
      isInitialized: false,

      // Initialize notification service
      initialize: async () => {
        if (get().isInitialized) return;

        try {
          console.log('[NotificationStore] Initializing...');

          // Initialize notification service
          const hasPermission = await notificationService.initialize();

          // Get permission status
          const status = await notificationService.getPermissionStatus();

          // Get push token if we have permission
          let token = null;
          if (hasPermission) {
            token = await notificationService.registerForPush();
          }

          set({
            pushToken: token,
            permissionStatus: status,
            isInitialized: true,
          });

          // Schedule notifications if enabled
          if (get().settings.pushEnabled && hasPermission) {
            await get().scheduleNotifications();
          }

          console.log('[NotificationStore] Initialized successfully');
        } catch (error) {
          console.error('[NotificationStore] Initialization failed:', error);
          set({ isInitialized: true });
        }
      },

      // Request notification permissions
      requestPermissions: async () => {
        try {
          const hasPermission = await notificationService.requestPermissions();
          const status = await notificationService.getPermissionStatus();

          set({ permissionStatus: status });

          if (hasPermission) {
            const token = await notificationService.registerForPush();
            set({ pushToken: token });
          }

          return hasPermission;
        } catch (error) {
          console.error('[NotificationStore] Failed to request permissions:', error);
          return false;
        }
      },

      // Toggle push notifications
      togglePushEnabled: async () => {
        const newValue = !get().settings.pushEnabled;

        set({
          settings: {
            ...get().settings,
            pushEnabled: newValue,
          },
        });

        if (newValue) {
          await get().scheduleNotifications();
        } else {
          await notificationService.cancelAllNotifications();
        }
      },

      // Toggle watering reminders
      toggleWateringReminders: async () => {
        const newValue = !get().settings.wateringReminders;

        set({
          settings: {
            ...get().settings,
            wateringReminders: newValue,
          },
        });

        if (get().settings.pushEnabled) {
          await get().scheduleNotifications();
        }
      },

      // Toggle plant care notifications
      togglePlantCare: async () => {
        const newValue = !get().settings.plantCare;

        set({
          settings: {
            ...get().settings,
            plantCare: newValue,
          },
        });
      },

      // Toggle achievements
      toggleAchievements: async () => {
        const newValue = !get().settings.achievements;

        set({
          settings: {
            ...get().settings,
            achievements: newValue,
          },
        });
      },

      // Toggle weekly report
      toggleWeeklyReport: async () => {
        const newValue = !get().settings.weeklyReport;

        set({
          settings: {
            ...get().settings,
            weeklyReport: newValue,
          },
        });

        if (get().settings.pushEnabled) {
          await get().scheduleNotifications();
        }
      },

      // Toggle marketing
      toggleMarketing: async () => {
        const newValue = !get().settings.marketing;

        set({
          settings: {
            ...get().settings,
            marketing: newValue,
          },
        });
      },

      // Set reminder time
      setReminderTime: async (hour: number, minute: number) => {
        set({
          settings: {
            ...get().settings,
            reminderTime: { hour, minute },
          },
        });

        if (get().settings.pushEnabled && get().settings.wateringReminders) {
          await get().scheduleNotifications();
        }
      },

      // Set reminder days
      setReminderDays: async (days: number[]) => {
        set({
          settings: {
            ...get().settings,
            reminderDays: days,
          },
        });

        if (get().settings.pushEnabled && get().settings.wateringReminders) {
          await get().scheduleNotifications();
        }
      },

      // Update settings
      updateSettings: async (newSettings: Partial<NotificationSettings>) => {
        set({
          settings: {
            ...get().settings,
            ...newSettings,
          },
        });

        if (get().settings.pushEnabled) {
          await get().scheduleNotifications();
        }
      },

      // Schedule all notifications
      scheduleNotifications: async () => {
        try {
          // Cancel all existing notifications
          await notificationService.cancelAllNotifications();

          const { settings } = get();

          if (!settings.pushEnabled) return;

          // Schedule daily watering check
          if (settings.wateringReminders) {
            await notificationService.scheduleDailyReminder(
              settings.reminderTime.hour,
              settings.reminderTime.minute,
              'Plant Care Reminder',
              'Check which plants need watering today!'
            );
          }

          // Schedule weekly report (Monday at 9 AM)
          if (settings.weeklyReport) {
            await notificationService.scheduleWeeklyReminder(
              2, // Monday (1=Sunday, 2=Monday, etc.)
              9,
              0,
              'Weekly Plant Report',
              'See how your plants are doing this week!'
            );
          }

          console.log('[NotificationStore] Notifications scheduled successfully');
        } catch (error) {
          console.error('[NotificationStore] Failed to schedule notifications:', error);
        }
      },
    }),
    {
      name: 'notification-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

export default useNotificationStore;
