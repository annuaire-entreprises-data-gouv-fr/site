const fs = require('fs');
const {
  indexPage,
  renderDepartementsPage,
  renderNafsPage,
  renderResultsPage,
} = require('./page-tree-render');

class PageTreeBuilder {
  constructor() {
    this.dico = {};
    this.pageTreeDir = './public/departements/';
    this.pageCount = 0;
  }

  add = (canonical, naf, codePostal) => {
    const dep = codePostal
      ? parseInt(codePostal.slice(0, 2)).toString()
      : 'Inconnu';

    const isNafDefined = naf && naf.length === 6;
    const cleanNaf = isNafDefined ? naf : 'Code d’activité inconnu';

    if (!this.dico[dep]) {
      this.dico[dep] = {};
    }
    if (!this.dico[dep][cleanNaf]) {
      this.dico[dep][cleanNaf] = [];
    }
    this.dico[dep][cleanNaf].push(canonical);
  };

  getDeps = () => Object.keys(this.dico);

  getNafs = (dep) => Object.keys(this.dico[dep]);

  get = (dep, naf) => this.dico[dep][naf];

  build = () => {
    this.cleanPageTreeFolder();
    this.createFolder(this.pageTreeDir);

    // saving list of all departments
    const allDeps = this.getDeps();
    const departmentsPage = renderDepartementsPage(allDeps);
    this.saveFile(this.pageTreeDir + 'index.html', departmentsPage);

    allDeps.forEach((dep) => {
      const currentDepPath = `${this.pageTreeDir}${dep}/`;
      this.createFolder(currentDepPath);

      // saving list of all naf for current department
      const currentDepNafs = this.getNafs(dep);
      const nafsPage = renderNafsPage(dep, currentDepNafs);
      this.saveFile(currentDepPath + 'index.html', nafsPage);

      currentDepNafs.forEach((naf) => {
        const currentNafPath = `${currentDepPath}${naf}/`;
        this.createFolder(currentNafPath);

        // saving list of 100 first results for current naf, department
        const sirenList = this.get(dep, naf);
        const pageCount = Math.ceil(sirenList.length / 100);
        for (let pageNumber = 0; pageNumber < pageCount; pageNumber++) {
          const next100 = sirenList.slice(
            pageNumber,
            Math.min(sirenList.length, pageNumber + 100)
          );
          const resultsPage = renderResultsPage(
            dep,
            naf,
            next100,
            pageNumber + 1,
            pageCount
          );
          this.saveFile(
            currentNafPath + (pageNumber + 1) + '.html',
            resultsPage
          );
        }
      });
    });
    console.log(`💾 Page tree count : ${this.pageCount}`);
  };

  saveFile = (path, htmlAsString) => {
    this.pageCount++;
    fs.writeFileSync(path, htmlAsString);
  };

  cleanPageTreeFolder = () => {
    if (fs.existsSync(this.pageTreeDir)) {
      fs.rmSync(this.pageTreeDir, { recursive: true, force: true });
    }
  };

  createFolder = (path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  };
}

module.exports = { PageTreeBuilder };
