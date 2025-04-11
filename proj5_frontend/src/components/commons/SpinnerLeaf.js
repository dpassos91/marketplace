import React from 'react';
import './SpinnerLeaf.css'; // Onde está o CSS acima

function SpinnerLeaf() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="spinner-icon">
      <path d="M32 2C20 16 4 32 12 50s32 12 40 0c8-12-8-40-20-48z" fill="var(--primary-300)" />
    </svg>
  );
}

export default SpinnerLeaf;
