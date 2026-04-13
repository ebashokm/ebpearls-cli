import { DisposableEmailRepository } from '@app/data-access';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as https from 'https';
import { join } from 'path';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class DisposableEmailService
 * @typedef {DisposableEmailService}
 */
@Injectable()
export class DisposableEmailService {
  /**
   * Creates an instance of DisposableEmailService.
   *
   * @constructor
   * @param {DisposableEmailRepository} disposableEmailRepo
   */
  constructor(private readonly disposableEmailRepo: DisposableEmailRepository) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @returns {Promise<void>}
   */

  private readonly fileUrl =
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt';
  private readonly folder = 'temp';
  private readonly filePath = join(this.folder, 'domain.txt');

  async bulkUpdate() {
    try {
      this.ensureFolderExists();
      this.clearFile();
      await this.disposableEmailRepo.deleteMany({});
      await this.downloadFile();
      await this.processFile();
      this.cleanupFile();
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  private ensureFolderExists() {
    if (!fs.existsSync(this.folder)) {
      fs.mkdirSync(this.folder, { recursive: true });
    }
  }

  private clearFile() {
    fs.writeFileSync(this.filePath, '');
  }

  private async downloadFile(): Promise<void> {
    try {
      const fileStream = fs.createWriteStream(this.filePath);
      const response = await this.getFileResponse();
      await this.pipeToFile(response, fileStream);
    } catch (error) {
      this.cleanupFile();
      throw new Error(`Error downloading file: ${error.message}`);
    }
  }

  /**
   * Fetches the file from the given URL using HTTPS.
   */
  private getFileResponse() {
    return new Promise((resolve, reject) => {
      https.get(this.fileUrl, (response) => resolve(response)).on('error', reject);
    });
  }

  /**
   * Pipes the HTTP response stream to the file system.
   */
  private pipeToFile(response, fileStream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
      response.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve()));
      fileStream.on('error', reject);
    });
  }

  private async processFile() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      const domainArray = data.split('\n').map((domain) => ({
        domain,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await this.disposableEmailRepo.createMany(domainArray);
    } catch (err) {
      throw new Error(`Error processing file: ${err.message}`);
    }
  }

  private cleanupFile() {
    fs.unlink(this.filePath, (err) => {
      if (!err) console.log('File removed');
    });
  }
}
