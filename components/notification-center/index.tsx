'use client';

import { InternalError } from '#models/exceptions';
import { randomId } from '#utils/helpers';
import { useEffect, useState } from 'react';
import { NotificationBanner } from './notification-banner';
import styles from './styles.module.css';
import { Notification } from './types';

declare global {
  interface Window {
    addNotification?: (notification: Omit<Notification, 'id'>) => void;
  }
}

// use this variable to store notification. UseState is only used as component internal state.
let internatStateNotifications: Notification[] = [];

export const NotificationProvider = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    internatStateNotifications
  );

  const removeNotification = (id: string) => {
    internatStateNotifications = notifications.filter((n) => n.id !== id);
    setNotifications(internatStateNotifications);
  };

  const addNotification = (notification: Omit<Notification, 'id'>): void => {
    const id = randomId();
    const newNotification = { ...notification, id };
    internatStateNotifications = [
      ...internatStateNotifications,
      newNotification,
    ];

    setTimeout(() => {
      removeNotification(id);
    }, 4000);

    setNotifications(internatStateNotifications);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addNotification = addNotification;
    }
    return () => {
      delete window.addNotification;
    };
  }, []);

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          notification={notification}
          onDismiss={(id) => removeNotification(id)}
        />
      ))}
    </div>
  );
};

const pushNotification = (notif: Omit<Notification, 'id'>) => {
  if (typeof window === 'undefined' || !window.addNotification) {
    throw new InternalError({
      message: 'Notification center must be mounted in the layout first.',
    });
  }
  window.addNotification(notif);
};

export const showSuccessNotification = (title: string, message?: string) => {
  return pushNotification({ type: 'success', title, message });
};

export const showErrorNotification = (title: string, message?: string) => {
  return pushNotification({
    type: 'error',
    title,
    message: message || 'Une erreur est survenue',
  });
};
