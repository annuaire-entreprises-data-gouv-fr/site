import { getProtectedSirenList } from '#utils/helpers/is-protected-siren-or-siret';

export async function GET() {
  const protectedSirenList = await getProtectedSirenList();

  const content = Object.keys(protectedSirenList).join('\n');

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
