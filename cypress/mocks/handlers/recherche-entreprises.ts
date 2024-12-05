import { HttpResponse, HttpResponseResolver } from 'msw';

async function loadSnapshots(clientName: string) {
  const snapshotContext = require.context(
    `#clients/_test/`,
    true,
    /\.json$/,
    'lazy'
  );
  const snapshots = await Promise.all(
    snapshotContext
      .keys()
      .filter((fileName: string) =>
        fileName.includes(`/${clientName}/_snapshots/`)
      )
      .map((fileName: string) => {
        const snapshot = snapshotContext(fileName);
        return snapshot;
      })
  );
  return snapshots;
}

export const rechercheEntrepriseHandler: HttpResponseResolver = async ({
  request,
}) => {
  const snapshots = await loadSnapshots('clientSearchRechercheEntreprise');
  const q = new URL(request.url).searchParams.get('q');

  const snapshot = snapshots.find((snapshot: any) => {
    return snapshot.args.searchTerms === q;
  });

  if (!snapshot) {
    throw new Error('No snapshot found');
  }

  return HttpResponse.json(snapshot.result);
};
