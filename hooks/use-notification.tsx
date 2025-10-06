"use client";

import { createContext, useContext } from "react";

export enum NotificationTypeEnum {
  SUCCESS = "success",
  ERROR = "error",
}

export interface INotification {
  id: string;
  type: NotificationTypeEnum;
  title: string;
  message?: string;
}

export interface INotificationContext {
  showNotification: (notif: Omit<INotification, "id">) => void;
}

export const NotificationContext = createContext<INotificationContext | null>(
  null
);

export const useNotification = (): INotificationContext => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
