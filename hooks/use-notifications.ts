'use client';

import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

let notificationState: {
  notifications: Notification[];
  listeners: Set<(notifications: Notification[]) => void>;
} = {
  notifications: [],
  listeners: new Set(),
};

const updateListeners = () => {
  notificationState.listeners.forEach((listener) =>
    listener(notificationState.notifications)
  );
};

export const addNotification = (
  notification: Omit<Notification, 'id'>
): string => {
  const id = Math.random().toString(36).substr(2, 9);
  const newNotification = { ...notification, id };

  notificationState.notifications = [
    ...notificationState.notifications,
    newNotification,
  ];
  updateListeners();
  return id;
};

export const removeNotification = (id: string) => {
  notificationState.notifications = notificationState.notifications.filter(
    (n) => n.id !== id
  );
  updateListeners();
};

/**
 * Be careful, <NotificationsProvider /> must be mounted in the DOM for this to work !
 *
 * @returns a hook that can display notifications in the UI
 *
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationState.notifications
  );

  useEffect(() => {
    notificationState.listeners.add(setNotifications);
    return () => {
      notificationState.listeners.delete(setNotifications);
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
  };
};

// Convenience functions for common notification types
export const showSuccess = (title: string, message?: string) => {
  return addNotification({ type: 'success', title, message });
};

export const showError = (title: string, message?: string) => {
  return addNotification({ type: 'error', title, message, duration: 8000 });
};

export const showWarning = (title: string, message?: string) => {
  return addNotification({ type: 'warning', title, message });
};

export const showInfo = (title: string, message?: string) => {
  return addNotification({ type: 'info', title, message });
};
