(() => {
  const labels = {
    aborted: 'Le téléchargement a échoué',
    started: 'Le téléchargement a commencé',
    pending: 'Téléchargement en cours',
    retried:
      'Le téléchargement prend plus de temps que prévu. Merci de patienter.',
    downloaded: 'Le téléchargement a réussi',
  };

  const LOCAL_STORAGE_KEY = 'downloadManager';

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
      init() {
        try {
          const downloads = window.localStorage.getItem(LOCAL_STORAGE_KEY);
          this.downloads = JSON.parse(downloads);
          this.triggerUpdate();
        } catch {
          window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      },

      downloads: {},

      async download(siren) {
        const response = await fetch(`/api/inpi-pdf-proxy/create/${siren}`);
        const { slug } = await response.json();
        const createdAt = new Date().getTime();
        this.downloads[slug] = {
          slug,
          error: null,
          name: `Justificatif - ${siren}`,
          href: `/resources/downloads/${slug}.pdf`,
          label: labels['started'],
          status: 'started',
          createdAt,
          lastUpdate: createdAt,
        };

        this.triggerUpdate();
      },
      abortDownload(slug) {
        delete this.downloads[slug];
        this.saveOnLocalStorage();
      },

      async triggerUpdate() {
        const finalStatus = ['aborted', 'downloaded'];
        const statusToUpdate = Object.values(this.downloads)
          .filter((download) => finalStatus.indexOf(download.status) === -1)
          .map((dl) => dl.slug);

        if (statusToUpdate.length > 0) {
          const updatedStatus = await fetch(`/api/inpi-pdf-proxy/status`, {
            method: 'POST',
            body: JSON.stringify(statusToUpdate),
          }).then((response) => response.json());

          updatedStatus.forEach(({ slug, status }) => {
            this.downloads[slug].status = status;
            this.downloads[slug].label = labels[status];
            this.downloads[slug].lastUpdate = new Date().getTime();
          });

          Object.values(this.downloads).forEach((download) => {
            if (new Date().getTime() - download.createdAt > 1000 * 3600) {
              this.abortDownload(download.slug);
            }
            // need to clean download manager at some point
          });

          window.setTimeout(() => this.triggerUpdate(), 2500);
          this.saveOnLocalStorage();
        }
      },

      saveOnLocalStorage() {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(this.downloads)
        );
      },
    });
  });
})();
