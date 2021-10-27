const DownloadManager = () => (
  <>
    <div
      role="dialog"
      dangerouslySetInnerHTML={{
        __html: `
          <div
            x-show="Object.keys($store.downloadManager.downloads).length > 0"
            id="download-manager"
            x-data="{ items: $store.downloadManager.downloads }">
            <div class="label">
              Gestionnaire de téléchargement
            </div>
            <ul>
              <template x-for="item in Object.values(items)">
                <li>
                  <div>
                    <div><i x-text="'justificatif_'+item.siren+'.pdf'"></i></div>
                    <template x-if="item.status!=='downloaded'">
                      <span x-text="item.label"></span>
                    </template>
                    <template x-if="item.status==='downloaded'">
                      <a x-bind:href="'/resources/downloads/'+item.slug+'.pdf'" target="_blank" rel="noopener noreferrer">→ télécharger le document PDF</a>
                    </template>
                    <template x-if="item.status==='aborted'">
                      <button @click="$store.downloadManager.retryDownload(item.siren, item.slug)">→ réessayer</button>
                    </template>
                    </div>
                  <button @click="$store.downloadManager.deleteDownload(item.slug)">✖︎</button>
                </li>
              </template>
            </template>
            </ul>
          </div>
        `,
      }}
    />
    <style global jsx>{`
      #download-manager {
        position: fixed;
        padding: 0;
        background: #fff;
        left: 10px;
        bottom: 10px;
        border: 1px solid #000091;
        border-radius: 5px;
        z-index: 1000;
        font-size: 0.9rem;
        width: 400px;
        max-width: calc(100% - 20px);
      }
      #download-manager > div {
        color: #fff;
        background-color: #000091;
        font-weight: bold;
        padding: 3px 7px;
      }

      #download-manager > ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
      }
      #download-manager > ul > li {
        padding: 7px;
        border-top: 0.5px solid #000091;
        display: flex;
        align-items: start;
        justify-content: space-between;
      }
      @media print {
        #download-manager {
          display: none;
        }
      }
    `}</style>
  </>
);

export default DownloadManager;
