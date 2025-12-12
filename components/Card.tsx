import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 ${className}`}>
      {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};