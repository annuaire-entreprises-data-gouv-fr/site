import { Stats } from 'fs';
import { FileSystemProvider } from '.';

class FileSystemMockup implements FileSystemProvider {
  exists(dir: string) {
    return true;
  }

  async createDir(dir: string, options: { recursive: boolean }) {
    return '';
  }

  async writeFile(path: string, data: string, options: any) {
    return;
  }

  async readdir(dir: string) {
    return [];
  }

  async stats(path: string) {
    return new Stats();
  }

  async delete(path: string) {
    return;
  }
}

const fileSystemMockup = new FileSystemMockup();

export default fileSystemMockup;
