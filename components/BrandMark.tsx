import React from 'react';

export function BrandMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/images/logo.svg"
      alt="SignalForge"
      width={size}
      height={size}
      className={className}
    />
  );
}
