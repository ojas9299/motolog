import React from 'react';

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.color - Spinner color
 * @param {string} props.className - Additional CSS classes
 */
const Spinner = ({ size = 'md', color = 'indigo', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return 'border-white';
      case 'gray':
        return 'border-gray-500';
      case 'red':
        return 'border-red-500';
      case 'green':
        return 'border-green-500';
      case 'blue':
        return 'border-blue-500';
      default:
        return 'border-indigo-600';
    }
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${getSizeClasses()} ${getColorClasses()} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Spinner; 