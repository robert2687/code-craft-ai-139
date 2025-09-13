// src/app/preview/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function PreviewPage() {
  const [code, setCode] = useState('');

  useEffect(() => {
    // This component runs only on the client side
    const storedCode = localStorage.getItem('generatedCode');
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

  if (!code) {
    // You can render a loading state or a placeholder
    return <div>Loading preview...</div>;
  }

  return <div dangerouslySetInnerHTML={{ __html: code }} />;
}
