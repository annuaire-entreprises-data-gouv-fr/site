import {
  CornerBannerError,
  CornerBannerSuccess,
} from '#components-ui/alerts/corner';
import styles from './styles.module.css';
import { Notification } from './types';

export const NotificationBanner = ({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) => {
  const { id, type, title, message } = notification;

  switch (type) {
    case 'success':
      return (
        <CornerBannerSuccess onDismiss={() => onDismiss(id)}>
          <strong>{title}</strong>
          {message && <div className={styles.message}>{message}</div>}
        </CornerBannerSuccess>
      );
    case 'error':
    default:
      return (
        <CornerBannerError onDismiss={() => onDismiss(id)}>
          <strong>{title}</strong>
          {message && <div className={styles.message}>{message}</div>}
        </CornerBannerError>
      );
  }
};
