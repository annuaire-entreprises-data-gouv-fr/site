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
                    <div>
                      <span x-text="'justificatif_'+item.siren+'.pdf'"></span>
                    </div>
                      <span x-bind:class="item.status+' tag'" x-text="$store.downloadManager.extractLabel(item.status)"></span>
                      <template x-if="item.status==='downloaded'">
                        &nbps;
                        <button class="action" @click="$store.downloadManager.openFile(item.slug)">ouvrir</button>
                      </template>
                      <template x-if="item.status==='aborted'">
                        &nbps;
                        <button class="action" @click="$store.downloadManager.retryDownload(item.siren, item.slug)">réessayer</button>
                      </template>
                    </div>
                  <button class="close" @click="$store.downloadManager.deleteDownload(item.slug)">✖︎</button>
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
        color: #000091;
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
        padding: 8px 7px;
        display: flex;
        align-items: start;
        justify-content: space-between;
      }
      #download-manager .tag {
        font-size: 0.9rem;
        padding: 0px 5px;
        font-weight: bold;
        background-color: #eee;
        color: #666;
        border-radius: 3px;
      }
      #download-manager .tag.aborted {
        color: #914141;
        background-color: #ffe5e5;
      }
      #download-manager .tag.downloaded {
        color: #326f00;
        background-color: #cdf2c0;
      }
      #download-manager button.action {
        background: none;
        color: #000091;
        text-decoration: underline;
      }
      #download-manager button.close {
        color: #000091;
        background: #dfdff1;
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
