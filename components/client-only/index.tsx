// Even with 'use client', Next.js pre-renders components on the server.
// This wrapper delays rendering until the component has mounted on the client.

import React, { useEffect, useState } from 'react';

export default function ClientOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return children;
}
