"use client";

import { useCallback, useState } from "react";
import {
  CornerBannerError,
  CornerBannerInfo,
  CornerBannerSuccess,
} from "#components-ui/alerts/corner";
import {
  type INotification,
  NotificationContext,
  NotificationTypeEnum,
} from "#hooks/use-notification";
import { randomId } from "#utils/helpers";
import styles from "./styles.module.css";

export const NotificationBanner = ({
  notification,
  onDismiss,
}: {
  notification: INotification;
  onDismiss: (id: string) => void;
}) => {
  const { id, type, title, message } = notification;

  switch (type) {
    case NotificationTypeEnum.SUCCESS:
      return (
        <CornerBannerSuccess onDismiss={() => onDismiss(id)}>
          <strong>{title}</strong>
          {message && <div className={styles.message}>{message}</div>}
        </CornerBannerSuccess>
      );
    case NotificationTypeEnum.ERROR:
      return (
        <CornerBannerError onDismiss={() => onDismiss(id)}>
          <strong>{title}</strong>
          {message && <div className={styles.message}>{message}</div>}
        </CornerBannerError>
      );
    default:
      return (
        <CornerBannerInfo onDismiss={() => onDismiss(id)}>
          <strong>{title}</strong>
          {message && <div className={styles.message}>{message}</div>}
        </CornerBannerInfo>
      );
  }
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback(
    ({ type, title, message = "" }: Omit<INotification, "id">) => {
      const id = randomId();
      const newNotification: INotification = {
        id,
        type,
        title,
        message,
      };

      setNotifications((prev) => [...prev, newNotification]);

      setTimeout(() => {
        removeNotification(id);
      }, 4000);
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
      }}
    >
      {children}
      <div className={styles.container}>
        {notifications.map((notification) => (
          <NotificationBanner
            key={notification.id}
            notification={notification}
            onDismiss={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
