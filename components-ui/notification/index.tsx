'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { Notification, useNotifications } from '#hooks/use-notifications';
import { useEffect } from 'react';
import styles from './styles.module.css';

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onDismiss,
}: NotificationItemProps) => {
  const { id, type, title, message, duration = 5000, action } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'successFill';
      case 'error':
        return 'errorFill';
      case 'warning':
        return 'alertFill';
      case 'info':
      default:
        return 'information';
    }
  };

  return (
    <div className={`${styles.notification} ${styles[type]}`} role="alert">
      <div className={styles.icon}>
        <Icon slug={getIcon()} size={20} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {message && <div className={styles.message}>{message}</div>}
        {action && (
          <button className={styles.action} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
      <button
        className={styles.close}
        onClick={() => onDismiss(id)}
        aria-label="Fermer la notification"
      >
        <Icon slug="closed" size={16} />
      </button>
    </div>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer = ({
  notifications,
  onDismiss,
}: NotificationContainerProps) => {
  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

// Main component that uses the hook
export const NotificationProvider = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <NotificationContainer
      notifications={notifications}
      onDismiss={removeNotification}
    />
  );
};
