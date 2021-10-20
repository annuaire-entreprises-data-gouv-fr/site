const DownloadManager = () => (
  <>
    <div
      role="dialog"
      dangerouslySetInnerHTML={{
        __html: `
          <div class="download-manager" x-data="{ items: $store.downloadManager.get() }">
            <ul>
              <template x-for="(item, index) in items">
                <li>
                  <div x-text="item.name"></div>
                  <div class="progress-bar">
                    <span class="background"></span>
                    <span class="progress" x-bind:style="'width:'+item.progress+'%'"></span>
                  </div>
                  <div x-text="item.progress+'%'"></div>
                  <button @click="$store.downloadManager.remove(index)">✖︎</button>
                </li>
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
        width: 300px;
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
      .download-manager > ul > li > div:first-of-type {
        max-width: 50px;
      }
      .download-manager > ul > li > .progress-bar {
        display: flex;
        position: relative;
        width: 200px;
      }
      .download-manager > ul > li > .progress-bar > span {
        position: absolute;
        left: 0;
        top: 0;
        height: 3px;
      }

      .download-manager > ul > li .progress {
        background-color: #000091;
      }
      .download-manager > ul > li .background {
        background-color: #ccc;
        width: 100%;
      }
    `}</style>
  </>
);

export default DownloadManager;
