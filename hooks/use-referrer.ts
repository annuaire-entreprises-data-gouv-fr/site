'use client';

import { useEffect, useState } from 'react';

const useReferrer = () => {
  const [referrer, setReferrer] = useState<string | null>(null);

  useEffect(() => {
    setReferrer(document.referrer);
  }, []);

  return referrer;
};

export default useReferrer;
