import { useRouter } from 'next/router';

export default function usePathFromRouter(): string | null {
  const router = useRouter();

  const path = (router?.asPath || '') as string;
  return path;
}
