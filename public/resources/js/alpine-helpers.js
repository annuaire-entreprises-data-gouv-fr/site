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
        this.triggerUpdate();
      },
      remove(index) {
        this.downloads.splice(index, 1);
      },
      get() {
        return this.downloads;
      },
      triggerUpdate() {
        for (let i = 0; i < this.downloads.length; i++) {
          const currentProgress = this.downloads[i].progress;
          if (currentProgress < 99) {
            const progression =
              (Math.random() * 40) / (currentProgress / 10 + 1);

            this.downloads[i].progress = Math.min(
              99,
              Math.ceil(
                currentProgress + (Math.random() < 0.05 ? progression : 0)
              )
            );
          }
        }

        if (this.downloads.length > 0) {
          window.setTimeout(() => this.triggerUpdate(), 350);
        }
      },
    });
  });
})();
