'use client';

import { LucideIcon } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Icon wrapper that prevents hydration mismatches for Lucide React icons
 * by ensuring consistent rendering between server and client
 */
export function Icon({ icon: IconComponent, size = 16, className, fallback }: IconProps) {
  return (
    <ClientOnly fallback={fallback || <div style={{ width: size, height: size }} />}>
      <IconComponent size={size} className={className} />
    </ClientOnly>
  );
}
