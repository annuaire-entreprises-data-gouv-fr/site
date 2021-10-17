(() => {
  document.addEventListener('alpine:init', () => {
    Alpine.data('asyncButton', (to) => ({
      isLoading: false,
      error: null,

      initialize(id) {
        let e = document.getElementById(id);
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
        fetch(to)
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
  });
})();
