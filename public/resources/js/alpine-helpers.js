(() => {
  document.addEventListener('alpine:init', () => {
    Alpine.data('asyncButton', (idToClean) => ({
      isLoading: false,
      error: '',

      init() {
        let e = document.getElementById(idToClean);
        if (e) {
          e.style.display = 'none';
        }
      },

      download(siren) {
        this.error = '';
        const duplicate =
          this.$store.downloadManager.isAlreadyDownloading(siren);

        if (duplicate) {
          this.error = 'Ce document est déja en cours de téléchargement.';
        } else {
          this.$store.downloadManager.download(siren);
        }
      },
    }));

    const SESSION_STORAGE_KEY = 'downloadManager';
    const MAX_LIFESPAN = 10 * 60 * 1000;

    Alpine.store('downloadManager', {
      init() {
        try {
          const downloads = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
          if (downloads) {
            this.downloads = JSON.parse(downloads);
            this.filterOldDownloads();
            this.updateDownloadStatuses();
          }
        } catch (e) {
          console.log(e);
          window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      },

      downloads: {},
      _updateDownloadLock: false,

      async download(siren) {
        try {
          const response = await fetch(`/api/inpi-pdf-proxy/job/${siren}`);
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
        } catch (e) {
          const slug = Math.random().toString(16).substring(7);
          this.downloads[slug] = {
            slug,
            siren,
            label: 'Le téléchargement a échoué.',
            status: 'aborted',
            isPending: false,
          };
        }
      },
      deleteDownload(slug) {
        delete this.downloads[slug];
        this.saveOnLocalStorage();
      },
      filterOldDownloads() {
        const now = new Date();
        Object.keys(this.download).forEach((download) => {
          const shoulddelete =
            now.getTime() - download.createdAt < MAX_LIFESPAN;
          if (shoulddelete) {
            console.log(download);
            deleteDownload(download.slug);
          }
        });
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
        try {
          const updatedStatus = await fetch(`/api/inpi-pdf-proxy/job/status`, {
            method: 'POST',
            body: JSON.stringify(downloadsToUpdate),
          }).then((response) => response.json());

          updatedStatus.forEach(({ slug, status, isPending }) => {
            this.downloads[slug] = {
              ...this.downloads[slug],
              status,
              isPending,
            };
          });
        } catch (e) {
          console.error(e);
        }
      },

      saveOnLocalStorage() {
        const downloadIsEmpty = Object.keys(this.downloads).length === 0;
        if (downloadIsEmpty) {
          window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify(this.downloads)
        );
      },

      extractLabel(status) {
        switch (status) {
          case 'pending':
          case 'retried':
          case 'started':
            return 'en cours';
          case 'downloaded':
            return 'réussi';
          case 'aborted':
          default:
            return 'échoué';
        }
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
