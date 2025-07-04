import React from 'react';
import styled from 'styled-components';

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

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .spinner {
   width: 44px;
   height: 44px;
   animation: spinner-y0fdc1 2s infinite ease;
   transform-style: preserve-3d;
  }

  .spinner > div {
   background-color: rgba(0,77,255,0.2);
   height: 100%;
   position: absolute;
   width: 100%;
   border: 2px solid #004dff;
  }

  .spinner div:nth-of-type(1) {
   transform: translateZ(-22px) rotateY(180deg);
  }

  .spinner div:nth-of-type(2) {
   transform: rotateY(-270deg) translateX(50%);
   transform-origin: top right;
  }

  .spinner div:nth-of-type(3) {
   transform: rotateY(270deg) translateX(-50%);
   transform-origin: center left;
  }

  .spinner div:nth-of-type(4) {
   transform: rotateX(90deg) translateY(-50%);
   transform-origin: top center;
  }

  .spinner div:nth-of-type(5) {
   transform: rotateX(-90deg) translateY(50%);
   transform-origin: bottom center;
  }

  .spinner div:nth-of-type(6) {
   transform: translateZ(22px);
  }

  @keyframes spinner-y0fdc1 {
   0% {
    transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
   }

   50% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
   }

   100% {
    transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
   }
  }
`;

export default Loader; 