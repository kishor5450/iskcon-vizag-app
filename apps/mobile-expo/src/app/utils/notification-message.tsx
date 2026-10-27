import { Alert, Platform } from 'react-native';

export type NotificationPlacement = 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight';
export type IconType = 'success' | 'info' | 'error' | 'warning';

// Dynamically check for antd notification if in antd-compatible web environment
let antdNotification: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const antd = require('antd');
  antdNotification = antd?.notification;
  if (antdNotification?.config) {
    antdNotification.config({ maxCount: 3, duration: 5, placement: 'top' });
  }
} catch {
  // Native or non-antd environment - uses React Native Alert / Web Alert fallback
}

/**
 * Universal AlertMessages utility matching enterprise pattern.
 * Supports Ant Design notifications when available, with native React Native / Web Alert fallbacks.
 */
export class AlertMessages {
  static getErrorMessage = (content: string, placement: NotificationPlacement = 'topRight') => {
    if (antdNotification?.error) {
      antdNotification.error({
        message: `Error : ${content}`,
        placement,
      });
      return false;
    }

    const msg = typeof content === 'string' ? content : (content as any)?.message || 'An error occurred';
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).alert) {
      console.error(`[Error] ${msg}`);
      window.alert(`Error : ${msg}`);
    } else {
      Alert.alert('Error', msg);
    }
    return false;
  };

  static getSuccessMessage = (content: string, placement: NotificationPlacement = 'topRight') => {
    if (antdNotification?.success) {
      antdNotification.success({
        message: `Success : ${content}`,
        placement,
      });
      return false;
    }

    const msg = typeof content === 'string' ? content : (content as any)?.message || 'Success';
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).alert) {
      console.log(`[Success] ${msg}`);
      window.alert(`Success : ${msg}`);
    } else {
      Alert.alert('Success', msg);
    }
    return false;
  };

  static getWarningMessage = (content: string, placement: NotificationPlacement = 'topRight') => {
    if (antdNotification?.warning) {
      antdNotification.warning({
        message: `Warning : ${content}`,
        placement,
      });
      return false;
    }

    const msg = typeof content === 'string' ? content : (content as any)?.message || 'Warning';
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).alert) {
      console.warn(`[Warning] ${msg}`);
      window.alert(`Warning : ${msg}`);
    } else {
      Alert.alert('Warning', msg);
    }
    return false;
  };

  static getInfoMessage = (content: string, placement: NotificationPlacement = 'bottomRight') => {
    if (antdNotification?.info) {
      antdNotification.info({
        message: `Inform : ${content}`,
        placement,
      });
      return false;
    }

    const msg = typeof content === 'string' ? content : (content as any)?.message || 'Information';
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).alert) {
      console.info(`[Info] ${msg}`);
      window.alert(`Inform : ${msg}`);
    } else {
      Alert.alert('Info', msg);
    }
    return false;
  };

  static getCustomMessage = (icon: IconType, content: string, placement: NotificationPlacement = 'topRight') => {
    if (antdNotification?.open) {
      antdNotification.open({
        type: icon,
        message: content,
        placement,
      });
      return false;
    }

    const title = icon ? icon.charAt(0).toUpperCase() + icon.slice(1) : 'Notice';
    if (Platform.OS === 'web' && typeof window !== 'undefined' && (window as any).alert) {
      window.alert(`${title} : ${content}`);
    } else {
      Alert.alert(title, content);
    }
    return false;
  };

  render() {
    return null;
  }
}

export default AlertMessages;
