'use client';

const MatomoIframe = () => (
  <iframe
    style={{
      overflow: 'visible',
      borderWidth: '0',
      width: '100%',
    }}
    title="Optout cookie"
    src="https://stats.data.gouv.fr/index.php?module=CoreAdminHome&action=optOut&language=fr&backgroundColor=&fontColor=333&fontSize=16px&fontFamily=sans-serif&overflow=visible"
  ></iframe>
);

export default MatomoIframe;
