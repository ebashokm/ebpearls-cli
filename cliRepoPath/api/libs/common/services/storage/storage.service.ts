import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as rootPath from 'path';
import { promisify } from 'util';

@Injectable()
export class StorageService {
  checkIfFileorDirectoryExists(path: string) {
    return fs.existsSync(path);
  }

  async createFile(path: string, fileName: string, data: string) {
    const filePath = rootPath.join(__dirname, `../../../${path}`);
    if (!this.checkIfFileorDirectoryExists(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    const writeFile = promisify(fs.writeFile);
    return await writeFile(`${filePath}/${fileName}`, data, {
      encoding: 'utf-8',
      flag: 'w',
    });
  }

  async deleteFile(path: string) {
    const unlink = promisify(fs.unlink);
    const filePath = rootPath.join(__dirname, `../../../${path}`);

    if (this.checkIfFileorDirectoryExists(filePath)) {
      return await unlink(filePath);
    }
  }
}
