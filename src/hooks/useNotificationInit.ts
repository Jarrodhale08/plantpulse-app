/**
 * useNotificationInit Hook - PlantPulse
 *
 * Initializes notification service and sets up listeners.
 * Call this hook in _layout.tsx to initialize notifications when the app starts.
 */

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useNotificationStore } from '../stores/notificationStore';
import notificationService from '../services/notification.service';

export function useNotificationInit() {
  const router = useRouter();
  const { initialize } = useNotificationStore();

  useEffect(() => {
    // Initialize notification service
    initialize();

    // Set up notification received listener (foreground)
    const notificationReceivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('[NotificationInit] Notification received (foreground):', notification);
        // Handle foreground notification if needed
      }
    );

    // Set up notification response listener (user tapped notification)
    const notificationResponseSubscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('[NotificationInit] Notification response:', response);

        // Handle notification tap
        const data = response.notification.request.content.data;

        // Navigate based on notification data
        if (data.plantId) {
          // Navigate to plant detail screen
          router.push(`/plant/${data.plantId}` as any);
        } else if (data.screen) {
          // Navigate to specified screen
          router.push(data.screen as any);
        } else if (data.type === 'watering-reminder') {
          // Navigate to home screen
          router.push('/(tabs)');
        } else if (data.type === 'weekly-reminder') {
          // Navigate to progress/stats screen if available
          router.push('/(tabs)');
        }

        // Clear badge count when notification is handled
        notificationService.clearBadgeCount();
      }
    );

    // Set up listener for last notification response (app was opened from notification)
    const getLastNotificationResponse = async () => {
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();

      if (lastNotificationResponse) {
        const data = lastNotificationResponse.notification.request.content.data;

        // Navigate based on notification data
        if (data.plantId) {
          router.push(`/plant/${data.plantId}` as any);
        } else if (data.screen) {
          router.push(data.screen as any);
        }

        // Clear badge count
        notificationService.clearBadgeCount();
      }
    };

    getLastNotificationResponse();

    // Cleanup subscriptions on unmount
    return () => {
      notificationReceivedSubscription.remove();
      notificationResponseSubscription.remove();
    };
  }, [initialize, router]);
}

export default useNotificationInit;
