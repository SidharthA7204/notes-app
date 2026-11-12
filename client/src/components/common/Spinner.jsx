import React from 'react';

export const Spinner = ({ size = 'normal', className = '' }) => {
  const sizeClass = size === 'large' ? 'spinner-lg' : '';
  return <div className={`spinner ${sizeClass} ${className}`} role="status" aria-label="Loading" />;
};

export default Spinner;
