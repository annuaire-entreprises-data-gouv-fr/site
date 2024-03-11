import { headers } from 'next/headers';

export default function usePathServer(): string {
  const headersList = headers();
  // read the custom x-url header
  return headersList.get('x-pathname') || '';
}
