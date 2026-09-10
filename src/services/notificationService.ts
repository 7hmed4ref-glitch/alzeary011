// Notification Service
// Handles toast notifications and alerts

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

class NotificationService {
  private listeners: ((notification: Notification) => void)[] = [];

  // Subscribe to notifications
  subscribe(listener: (notification: Notification) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Show notification
  show(notification: Omit<Notification, 'id'>): void {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 3000,
    };

    this.listeners.forEach(listener => listener(fullNotification));
  }

  // Success notification
  success(title: string, message?: string): void {
    this.show({
      type: 'success',
      title,
      message,
    });
  }

  // Error notification
  error(title: string, message?: string): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: 5000,
    });
  }

  // Warning notification
  warning(title: string, message?: string): void {
    this.show({
      type: 'warning',
      title,
      message,
    });
  }

  // Info notification
  info(title: string, message?: string): void {
    this.show({
      type: 'info',
      title,
      message,
    });
  }
}

export const notificationService = new NotificationService();
