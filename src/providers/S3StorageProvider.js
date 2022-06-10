import 'dotenv/config';
import { resolve, dirname} from 'path';
import fs from 'fs';
import mime from 'mime';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default class S3StorageProvider {
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file) {    
    const originalName = resolve(__dirname,'..', '..', 'tmp', file);
    const fileContent = await fs.promises.readFile(originalName);
    const ContentType = mime.getType(originalName) || undefined;

    await this.client.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }));

    await fs.promises.unlink(originalName);

    return file;
  }
}
