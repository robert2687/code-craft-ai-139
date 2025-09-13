'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PreviewFrameProps {
  code: string;
  className?: string;
}

export function PreviewFrame({ code, className }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [code]);

  return (
    <iframe
      ref={iframeRef}
      className={cn('w-full h-full border-0', className)}
      title="Application Preview"
      sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
    ></iframe>
  );
}
