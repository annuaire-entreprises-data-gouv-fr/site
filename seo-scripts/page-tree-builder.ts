import fs from 'fs';
import { getDepartementFromCodePostal } from '../utils/labels';
import {
  getUrlFromDep,
  renderDepartementsPage,
  renderNafsPage,
  renderResultsPage,
} from './page-tree-render/index';

class PageTreeBuilder {
  private dico: { [dep: string]: { [naf: string]: string[] } };
  private pageTreeDir: string;
  private pageCount: number;
  private ignoredUrl: number;

  constructor() {
    this.dico = {};
    this.pageTreeDir = './dist/departements/';
    this.pageCount = 0;
    this.ignoredUrl = 0;
  }

  add = (canonical: string, naf: string, codePostal: string) => {
    const dep = getDepartementFromCodePostal(codePostal);

    if (!naf || !dep) {
      this.ignoredUrl += 1;
      return;
    }

    if (!this.dico[dep]) {
      this.dico[dep] = {};
    }
    if (!this.dico[dep][naf]) {
      this.dico[dep][naf] = [];
    }
    this.dico[dep][naf].push(canonical);
  };

  getDeps = () => Object.keys(this.dico);

  getNafs = (dep: string) => Object.keys(this.dico[dep]);

  get = (dep: string, naf: string) => this.dico[dep][naf];

  checkIgnoredUrlCount = () => {
    console.log(`🧽 Ignored url in pageTree : ${this.ignoredUrl}`);

    if (this.ignoredUrl > 250000) {
      throw new Error('Too many ignored url');
    }
  };

  build = () => {
    this.cleanPageTreeFolder();
    this.createFolder(this.pageTreeDir);

    // saving list of all departments
    const allDeps = this.getDeps();
    const departmentsPage = renderDepartementsPage(allDeps);
    this.saveFile(this.pageTreeDir + 'index.html', departmentsPage);

    allDeps.forEach((dep) => {
      const currentDepPath = `${this.pageTreeDir}${getUrlFromDep(dep)}/`;
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
          const start = pageNumber * 100;
          const next100 = sirenList.slice(
            start,
            Math.min(sirenList.length, start + 100)
          );

          const resultsPage = renderResultsPage(
            dep,
            naf,
            next100,
            pageNumber + 1,
            pageCount,
            sirenList.length
          );
          this.saveFile(
            currentNafPath + (pageNumber + 1) + '.html',
            resultsPage
          );
        }
        throw new Error('STOP');
      });
    });
    console.log(`💾 Page tree pages : ${this.pageCount}`);
  };

  saveFile = (path: string, htmlAsString: string) => {
    this.pageCount++;
    fs.writeFileSync(path, htmlAsString);
  };

  cleanPageTreeFolder = () => {
    if (fs.existsSync(this.pageTreeDir)) {
      fs.rmSync(this.pageTreeDir, { recursive: true, force: true });
    }
  };

  createFolder = (path: string) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  };

  getUrlsForSitemap = () => {
    return [
      '/departements/index.html',
      ...this.getDeps().map(
        (d) => `/departements/${getUrlFromDep(d)}/index.html`
      ),
    ];
  };
}

export { PageTreeBuilder };
