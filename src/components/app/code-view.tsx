'use client';

import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';

interface CodeViewProps {
  code: string;
}

export function CodeView({ code }: CodeViewProps) {
  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language="html"
        theme="vs-dark"
        value={code}
        loading={<Skeleton className="w-full h-full" />}
        options={{
          readOnly: true,
          domReadOnly: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
