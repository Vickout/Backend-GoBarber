import fs from 'fs';
import path from 'path';
import aws, { S3 } from 'aws-sdk';

import uplaodConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: 'us-east-1',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uplaodConfig.tmpFolder, file);

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: uplaodConfig.config.aws.bucket,
        Key: file,
        ACL: 'private', // lembrar de entender essas permissões
        Body: fileContent,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uplaodConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
