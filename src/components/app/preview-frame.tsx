'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface PreviewFrameProps {
  className?: string;
}

export function PreviewFrame({ className }: PreviewFrameProps) {
  // Use a state to force re-render when the content changes
  const [key, setKey] = useState(Date.now());

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'generatedCode') {
        setKey(Date.now()); // Update key to force iframe reload
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also update on initial mount
    setKey(Date.now());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <iframe
      key={key} // Use key to force re-creation of iframe
      src="/preview"
      className={cn('w-full h-full border-0', className)}
      title="Application Preview"
      sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
    ></iframe>
  );
}
