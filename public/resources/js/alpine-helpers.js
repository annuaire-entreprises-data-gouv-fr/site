(() => {
  const labels = {
    aborted: 'Le téléchargement a échoué',
    started: 'Le téléchargement a commencé',
    pending: 'Téléchargement en cours',
    retried: 'Téléchargement en cours',
    downloaded: 'Le téléchargement a réussi',
  };

  document.addEventListener('alpine:init', () => {
    Alpine.data('asyncButton', (idToClean) => ({
      init() {
        let e = document.getElementById(idToClean);
        if (e) {
          e.style.display = 'none';
        }
      },
    }));

    Alpine.store('downloadManager', {
      downloads: {},

      async download(siren) {
        const response = await fetch(`/api/inpi-pdf-proxy/create/${siren}`);
        const { slug } = await response.json();
        this.downloads[slug] = {
          slug,
          error: null,
          name: `Justificatif - ${siren}`,
          href: `/resources/downloads/${slug}.pdf`,
          label: labels['started'],
          status: 'started',
        };

        this.triggerUpdate();
      },
      abortDownload(slug) {
        delete this.downloads[slug];
      },

      async triggerUpdate() {
        const finalStatus = ['aborted', 'downloaded'];
        const statusToUpdate = Object.values(this.downloads)
          .filter((download) => finalStatus.indexOf(download.status) === -1)
          .map((dl) => dl.slug);

        const updatedStatus = await fetch(`/api/inpi-pdf-proxy/status`, {
          method: 'POST',
          body: JSON.stringify(statusToUpdate),
        }).then((response) => response.json());

        updatedStatus.forEach(({ slug, status }) => {
          this.downloads[slug].status = status;
          this.downloads[slug].label = labels[status];
        });

        if (statusToUpdate.length > 0) {
          window.setTimeout(() => this.triggerUpdate(), 2500);
        }
      },
    });
  });
})();
