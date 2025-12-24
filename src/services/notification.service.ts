/**
 * Notification Service - PlantPulse
 *
 * Handles push notifications using expo-notifications.
 * Manages permissions, local notifications, and push token registration.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// ============================================================================
// CONFIGURATION
// ============================================================================

// Set notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ============================================================================
// ANDROID CHANNELS
// ============================================================================

export const NOTIFICATION_CHANNELS = {
  DEFAULT: 'default',
  WATERING_REMINDERS: 'watering-reminders',
  PLANT_CARE: 'plant-care',
  ACHIEVEMENTS: 'achievements',
};

async function setupAndroidChannels(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.DEFAULT, {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.WATERING_REMINDERS, {
      name: 'Watering Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B82F6',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.PLANT_CARE, {
      name: 'Plant Care Tips',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250],
      lightColor: '#10B981',
    });

    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.ACHIEVEMENTS, {
      name: 'Achievements',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F59E0B',
      sound: 'default',
    });
  }
}

// ============================================================================
// PERMISSION MANAGEMENT
// ============================================================================

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (!Device.isDevice) {
      console.log('[Notifications] Not running on a physical device');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[Notifications] Permission not granted');
      return false;
    }

    // Setup Android channels
    await setupAndroidChannels();

    return true;
  } catch (error) {
    console.error('[Notifications] Permission request failed:', error);
    return false;
  }
}

export async function getNotificationPermissionStatus(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

// ============================================================================
// PUSH TOKEN REGISTRATION
// ============================================================================

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      console.log('[Notifications] Not running on a physical device');
      return null;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: '67c2667d-6254-41da-a5a7-ac8aec93cfd4',
    });

    const token = tokenData.data;
    console.log('[Notifications] Push token:', token);

    // Store token in database for server-side push notifications
    // await storeTokenInDatabase(token);

    return token;
  } catch (error) {
    console.error('[Notifications] Failed to get push token:', error);
    return null;
  }
}

// ============================================================================
// LOCAL NOTIFICATIONS
// ============================================================================

export async function scheduleWateringReminder(
  plantId: string,
  plantName: string,
  wateringTime: { hour: number; minute: number },
  daysOfWeek?: number[]
): Promise<string | null> {
  try {
    const trigger: Notifications.NotificationTriggerInput = daysOfWeek
      ? {
          hour: wateringTime.hour,
          minute: wateringTime.minute,
          repeats: true,
        }
      : {
          hour: wateringTime.hour,
          minute: wateringTime.minute,
          repeats: true,
        };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to Water!',
        body: `${plantName} needs watering today.`,
        data: { plantId, type: 'watering-reminder' },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    console.log('[Notifications] Scheduled watering reminder:', id);
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule watering reminder:', error);
    return null;
  }
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number,
  title: string,
  body: string
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'daily-reminder' },
        sound: 'default',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    console.log('[Notifications] Scheduled daily reminder:', id);
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule daily reminder:', error);
    return null;
  }
}

export async function scheduleWeeklyReminder(
  weekday: number,
  hour: number,
  minute: number,
  title: string,
  body: string
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'weekly-reminder' },
        sound: 'default',
      },
      trigger: {
        weekday,
        hour,
        minute,
        repeats: true,
      },
    });

    console.log('[Notifications] Scheduled weekly reminder:', id);
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to schedule weekly reminder:', error);
    return null;
  }
}

export async function sendImmediateNotification(
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
      },
      trigger: null,
    });

    console.log('[Notifications] Sent immediate notification:', id);
    return id;
  } catch (error) {
    console.error('[Notifications] Failed to send immediate notification:', error);
    return null;
  }
}

// ============================================================================
// NOTIFICATION MANAGEMENT
// ============================================================================

export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('[Notifications] Cancelled notification:', notificationId);
  } catch (error) {
    console.error('[Notifications] Failed to cancel notification:', error);
  }
}

export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[Notifications] Cancelled all notifications');
  } catch (error) {
    console.error('[Notifications] Failed to cancel all notifications:', error);
  }
}

export async function getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('[Notifications] Failed to get scheduled notifications:', error);
    return [];
  }
}

// ============================================================================
// NOTIFICATION LISTENERS
// ============================================================================

export function addNotificationReceivedListener(
  listener: (notification: Notifications.Notification) => void
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseReceivedListener(
  listener: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}

// ============================================================================
// BADGE MANAGEMENT
// ============================================================================

export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('[Notifications] Failed to set badge count:', error);
  }
}

export async function clearBadgeCount(): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('[Notifications] Failed to clear badge count:', error);
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

export async function initializeNotificationService(): Promise<boolean> {
  try {
    console.log('[Notifications] Initializing notification service...');

    // Setup Android channels
    await setupAndroidChannels();

    // Request permissions
    const hasPermission = await requestNotificationPermissions();

    if (hasPermission) {
      // Register for push notifications
      await registerForPushNotifications();
    }

    console.log('[Notifications] Notification service initialized');
    return hasPermission;
  } catch (error) {
    console.error('[Notifications] Failed to initialize notification service:', error);
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Initialization
  initialize: initializeNotificationService,

  // Permissions
  requestPermissions: requestNotificationPermissions,
  getPermissionStatus: getNotificationPermissionStatus,

  // Push tokens
  registerForPush: registerForPushNotifications,

  // Local notifications
  scheduleWateringReminder,
  scheduleDailyReminder,
  scheduleWeeklyReminder,
  sendImmediateNotification,

  // Management
  cancelNotification,
  cancelAllNotifications,
  getAllScheduledNotifications,

  // Listeners
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,

  // Badge
  setBadgeCount,
  clearBadgeCount,

  // Constants
  CHANNELS: NOTIFICATION_CHANNELS,
};
