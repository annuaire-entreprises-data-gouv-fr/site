import { useRouter } from 'next/router';

export default function usePathFromRouter(): string | null {
  try {
    const router = useRouter();

    const path = (router?.asPath || '') as string;
    return encodeURIComponent(path);
  } catch {
    return null;
  }
}
