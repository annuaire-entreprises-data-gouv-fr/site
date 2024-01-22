import { useRouter } from 'next/router';
import { extractSirenOrSiretSlugFromUrl } from '#utils/helpers';

export default function useSirenFromRouter(): string | null {
  const router = useRouter();

  const siren = extractSirenOrSiretSlugFromUrl(
    (router?.query?.slug || '') as string
  );
  return siren;
}
