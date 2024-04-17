import { Loader } from '#components-ui/loader';
import { Tag } from '#components-ui/tag';

export function PDFFLoading() {
  return (
    <>
      <Tag>
        <Loader /> téléchargement en cours
      </Tag>
      <span style={{ color: '#777', fontWeight: 'bold' }}>
        (temps estimé entre 10 secondes et 1 minute)
      </span>
    </>
  );
}
