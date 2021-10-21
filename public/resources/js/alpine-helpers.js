(() => {
  document.addEventListener('alpine:init', () => {
    Alpine.data('asyncButton', (href, idToClean) => ({
      isLoading: false,
      error: null,

      init() {
        let e = document.getElementById(idToClean);
        if (e) {
          e.style.display = 'none';
        }
      },

      click() {
        if (this.isLoading) {
          return;
        }
        this.error = null;
        this.isLoading = true;
        fetch(href)
          .then((response) => {
            if (response.redirected) {
              throw new Error('Redirected to error page');
            }

            try {
              response.blob().then((blob) => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'immatriculation.pdf';
                a.click();
              });
            } catch (e) {
              this.error = ERROR;
              window.location.href = response.url;
            } finally {
              this.isLoading = false;
            }
          })
          .catch((e) => {
            this.error = ERROR;
            this.isLoading = false;
          });
      },
    }));

    Alpine.store('downloadManager', {
      downloads: [],

      add(href) {
        this.downloads.push({
          href,
          name: href,
          progress: 1,
          timestamp: new Date().getTime(),
        });
      },
      remove(index) {
        this.downloads.splice(index, 1);
      },
      get() {
        return this.downloads;
      },
    });
  });
})();
