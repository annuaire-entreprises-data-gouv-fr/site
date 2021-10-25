(() => {
  (function () {
    let e = document.getElementsByClassName('copy-to-clipboard-anchor');
    for (var t = 0; t < e.length; t++) {
      let o = e[t];
      o.onclick = () => {
        o.classList.toggle('copy-done');
        var n = document.createElement('textarea'),
          i = o.children[0].innerHTML;
        o.className.indexOf('trim') > -1 && (i = i.split(' ').join('')),
          (n.value = i),
          document.body.appendChild(n),
          n.select(),
          document.execCommand('copy'),
          document.body.removeChild(n),
          window.setTimeout(function () {
            o.classList.toggle('copy-done');
          }, 800);
      };
    }
  })();
  (function () {
    (window.showNPSModal = function () {
      var e = document.getElementById('nps-modal');
      e && (e.style.display = 'block');
    }),
      (window.closeNPSModal = function () {
        var e = document.getElementById('nps-modal');
        e && (e.style.display = 'none'), window.localStorage.setItem('u', !0);
      }),
      (window.showWeNeedYouModal = function () {
        var e = document.getElementById('we-need-you-modal');
        e && (e.style.display = 'flex'), window.localStorage.setItem('u', !0);
      }),
      (window.closeWeNeedYouModal = function () {
        var e = document.getElementById('we-need-you-modal');
        e && (e.style.display = 'none');
      });
  })();
  (function () {
    try {
      var e = window.location.pathname,
        t = window.localStorage.getItem('u') || !1;
      if (t || e === '/') return;
      var o = window.sessionStorage.getItem('p') || 0;
      window.sessionStorage.setItem('p', parseInt(o, 10) + 1),
        o >= 2 && window.showNPSModal(),
        (e.indexOf('/entreprise') === 0 && o >= 2) ||
          (e.indexOf('/rechercher') === 0 && o >= 3) ||
          (e.indexOf('/justificatif') === 0 && o >= 2) ||
          (e.indexOf('/annonces') === 0 && o >= 2) ||
          (e.indexOf('/etablissement') === 0 && o >= 2);
    } catch (n) {}
  })();
  (() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('asyncButton', (l, e) => ({
        isLoading: !1,
        error: null,
        init() {
          let t = document.getElementById(e);
          t && (t.style.display = 'none');
        },
        click() {
          this.isLoading ||
            ((this.error = null),
            (this.isLoading = !0),
            fetch(l)
              .then((t) => {
                if (t.redirected) throw new Error('Redirected to error page');
                try {
                  t.blob().then((o) => {
                    let n = window.URL.createObjectURL(o),
                      i = document.createElement('a');
                    (i.href = n),
                      (i.download = 'immatriculation.pdf'),
                      i.click();
                  });
                } catch (o) {
                  (this.error = ERROR), (window.location.href = t.url);
                } finally {
                  this.isLoading = !1;
                }
              })
              .catch((t) => {
                (this.error = ERROR), (this.isLoading = !1);
              }));
        },
      }));
    });
  })();
})();
