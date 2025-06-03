import { useEffect, useRef } from 'react';
import { Notification } from './notification';
import { useNotifications } from './notifications-store';

export const Notifications = () => {
  const { notifications, dismissNotification } = useNotifications();

  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Cleanup timeouts on unmount
    return () => {
      timeoutIds.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end space-y-4 px-4 py-6 sm:items-start sm:p-6"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};
