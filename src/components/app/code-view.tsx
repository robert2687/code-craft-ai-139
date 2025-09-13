'use client';

import { useEffect, useRef } from 'react';

// This is a workaround for highlight.js not having official types
// for the global object.
declare global {
  interface Window {
    hljs?: {
      highlightElement: (element: HTMLElement) => void;
    };
  }
}

interface CodeViewProps {
  code: string;
}

export function CodeView({ code }: CodeViewProps) {
  const codeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // highlight.js is loaded from a CDN in layout.tsx
    if (codeRef.current && window.hljs) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div className="w-full h-full overflow-auto p-4">
      <pre className="h-full">
        <code ref={codeRef} className="language-html text-sm !bg-transparent !p-0 h-full">
          {code}
        </code>
      </pre>
    </div>
  );
}
