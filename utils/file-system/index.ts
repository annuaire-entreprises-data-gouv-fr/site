import fs from 'fs';

export class FileSystemProvider {
  exists(dir: string) {
    return fs.existsSync(dir);
  }

  async createDir(dir: string, options: { recursive: boolean }) {
    return await fs.promises.mkdir(dir, options);
  }

  async writeFile(path: string, data: string, options: any) {
    return await fs.promises.writeFile(path, data, options);
  }

  async readdir(dir: string) {
    return await fs.promises.readdir(dir);
  }

  async stats(path: string) {
    return await fs.promises.stat(path);
  }

  async delete(path: string) {
    return await fs.promises.unlink(path);
  }
}

const fileSystem = new FileSystemProvider();

export default fileSystem;
