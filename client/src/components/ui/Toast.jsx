import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast notification component
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, warning, info)
 * @param {boolean} props.visible - Whether toast is visible
 * @param {Function} props.onClose - Close handler
 */
const Toast = ({ message, type = 'success', visible, onClose }) => {
  if (!visible || !message) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '💬';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.3 }}
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg max-w-sm ${getToastStyles()}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getIcon()}</span>
              <span className="font-medium">{message}</span>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast; 