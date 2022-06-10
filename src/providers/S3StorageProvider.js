import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { getCurrentDirname } from '../utils/path.js';

const __dirname = getCurrentDirname(import.meta.url);


export default class S3StorageProvider {
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file) {    
    const originalName = path.resolve(__dirname,'..', '..', 'tmp', file);
    const fileContent = await fs.promises.readFile(originalName);
    const ContentType = mime.getType(originalName) || undefined;

    try {
      await this.client.send(new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType,
      }));
    }
    catch(e) {
      console.error("Error: Not able save the screenshot", e);
      throw new Error('[my-cli-browser] AWS S3 Error', e);
    }

    try {
      await fs.promises.unlink(originalName);
    }
    catch(e) {
      console.error("Error: Not able delete screenshot file from /tmp directory (in disk)", e);
      throw new Error('[my-cli-browser] AWS S3 Error', e);
    }

  }
}
