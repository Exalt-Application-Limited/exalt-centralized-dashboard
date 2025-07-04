import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertProps } from '@mui/material';

interface Notification {
  id: string;
  message: string;
  severity: AlertProps['severity'];
  autoHideDuration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, severity?: AlertProps['severity']) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, severity: AlertProps['severity'] = 'info') => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      message,
      severity,
      autoHideDuration: 6000,
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-hide after duration
    setTimeout(() => {
      hideNotification(id);
    }, notification.autoHideDuration);
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.autoHideDuration}
          onClose={() => hideNotification(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => hideNotification(notification.id)} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};