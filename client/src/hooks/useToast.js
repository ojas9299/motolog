import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast state and operations
 */
export const useToast = () => {
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type, visible: true });

    // Auto-hide after duration
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, duration);
  }, []);

  /**
   * Hide the current toast
   */
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  /**
   * Show success toast
   * @param {string} message - Success message
   */
  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  /**
   * Show error toast
   * @param {string} message - Error message
   */
  const showError = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  /**
   * Show warning toast
   * @param {string} message - Warning message
   */
  const showWarning = useCallback((message) => {
    showToast(message, 'warning');
  }, [showToast]);

  /**
   * Show info toast
   * @param {string} message - Info message
   */
  const showInfo = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}; 