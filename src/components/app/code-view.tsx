'use client';

import Editor from '@monaco-editor/react';
import { Skeleton } from '../ui/skeleton';

interface CodeViewProps {
  code: string;
  onCodeChange: (newCode: string | undefined) => void;
}

export function CodeView({ code, onCodeChange }: CodeViewProps) {
  return (
    <div className="w-full h-full">
      <Editor
        height="100%"
        language="html"
        theme="vs-dark"
        value={code}
        onChange={onCodeChange}
        loading={<Skeleton className="w-full h-full" />}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
