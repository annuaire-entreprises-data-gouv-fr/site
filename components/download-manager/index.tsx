const DownloadManager = () => (
  <>
    <div
      role="dialog"
      dangerouslySetInnerHTML={{
        __html: `
          <div
            x-show="Object.keys($store.downloadManager.downloads).length > 0"
            class="download-manager"
            x-data="{ items: $store.downloadManager.downloads }">
            <ul>
              <template x-for="item in Object.values(items)">
                <li>
                  <div>
                    <div><i x-text="item.name"></i></div>
                    <div x-text="item.label"></div>
                    <template x-if="item.status==='downloaded'">
                      <a x-bind:href="item.href">→ télécharger</button>
                    </template>
                  </div>
                  <button @click="$store.downloadManager.abortDownload(item.slug)">✖︎</button>
                </li>
              </template>
            </template>
            </ul>
          </div>
        `,
      }}
    />
    <style global jsx>{`
      .download-manager {
        position: fixed;
        padding: 0;
        background: #fff;
        left: 20px;
        bottom: 20px;
        border: 1px solid #000091;
        border-radius: 2px;
        z-index: 1000;
        font-size: 0.9rem;
        width: 100%;
        max-width: 400px;
      }
      .download-manager > ul {
        padding: 0;
        margin: 0;
        list-style-type: none;
      }
      .download-manager > ul > li {
        padding: 7px;
        border: 0.5px solid #000091;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  </>
);

export default DownloadManager;
