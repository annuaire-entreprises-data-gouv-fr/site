(() => {
  const LOCAL_STORAGE_KEY = 'downloadManager';

  document.addEventListener('alpine:init', () => {
    Alpine.data('asyncButton', (idToClean) => ({
      init() {
        let e = document.getElementById(idToClean);
        if (e) {
          e.style.display = 'none';
        }
      },
      warning: '',

      download(siren) {
        this.warning = '';
        const duplicate =
          this.$store.downloadManager.isAlreadyDownloading(siren);

        if (duplicate) {
          this.warning = 'Ce document est déja en cours de téléchargement.';
        } else {
          this.$store.downloadManager.download(siren);
        }
      },
    }));

    Alpine.store('downloadManager', {
      init() {
        try {
          const downloads = window.sessionStorage.getItem(LOCAL_STORAGE_KEY);
          if (downloads) {
            this.downloads = JSON.parse(downloads);
            this.updateDownloadStatuses();
          }
        } catch {
          window.sessionStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      },

      warning: '',
      downloads: {},
      _updateDownloadLock: false,

      async download(siren) {
        const response = await fetch(`/api/inpi-pdf-proxy/create/${siren}`);
        const { slug } = await response.json();
        const createdAt = new Date().getTime();
        this.downloads[slug] = {
          slug,
          siren,
          label: 'Le téléchargement commence.',
          status: 'started',
          createdAt: createdAt,
          isPending: true,
        };

        this.updateDownloadStatuses();
      },
      deleteDownload(slug) {
        delete this.downloads[slug];
        this.saveOnLocalStorage();
      },
      retryDownload(siren, slug) {
        this.deleteDownload(slug);
        this.download(siren);
      },
      isAlreadyDownloading(siren) {
        return Object.values(this.downloads).reduce((acc, elem) => {
          return acc || (elem.siren === siren && elem.isPending);
        }, false);
      },
      async updateDownloadStatuses(isFirstCall = true) {
        if (isFirstCall) {
          if (this._updateDownloadLock) {
            return;
          } else {
            this._updateDownloadLock = true;
          }
        }

        const downloadsToUpdate = this.filterDownloadsForUpdate();
        const updateIsRequired = downloadsToUpdate.length > 0;

        if (updateIsRequired) {
          await this.callApiAndUpdateStatuses(downloadsToUpdate);
          this.saveOnLocalStorage();
          window.setTimeout(() => this.updateDownloadStatuses(false), 4 * 1000);
        } else {
          this._updateDownloadLock = false;
        }
      },

      async callApiAndUpdateStatuses(downloadsToUpdate) {
        const updatedStatus = await fetch(`/api/inpi-pdf-proxy/status`, {
          method: 'POST',
          body: JSON.stringify(downloadsToUpdate),
        }).then((response) => response.json());

        updatedStatus.forEach(({ slug, status, label, isPending }) => {
          this.downloads[slug] = {
            ...this.downloads[slug],
            status,
            label,
            isPending,
          };
        });
      },

      saveOnLocalStorage() {
        const downloadIsEmpty = Object.keys(this.downloads).length === 0;
        if (downloadIsEmpty) {
          window.sessionStorage.removeItem(LOCAL_STORAGE_KEY);
        }
        window.sessionStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(this.downloads)
        );
      },

      filterDownloadsForUpdate() {
        return Object.values(this.downloads).reduce((acc, download) => {
          if (download.isPending) {
            acc.push(download.slug);
          }
          return acc;
        }, []);
      },
    });
  });
})();
