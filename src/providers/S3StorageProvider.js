import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import mime from 'mime';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
 
import { S3AxiosClient } from './AxiosApiClientProvider.js';
import { getCurrentDirname } from '../utils/path.js';

const __dirname = getCurrentDirname(import.meta.url);
const s3AxiosClient = new S3AxiosClient();

export const S3StorageProvider = (axiosClient = s3AxiosClient) => {

  const client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
  });

  // Public
  async function shouldSalve(file, expiryTimeInSeconds) {
    let isExpired = false;
  
    try {
      const s3Response = await get(file);

      const lastModified = new Date(s3Response.headers["last-modified"]).getTime();
      isExpired = (new Date().getTime() - lastModified) / 1000 > expiryTimeInSeconds; // modified more than 3 weeks ago?
      // console.log(
      //   "Last Modified X Today",
      //   new Date(lastModified).toISOString(),
      //   `X ${(new Date()).toISOString()}`,
      //   "\nIs Expired?",
      //   isExpired
      // );
    }
    catch { 
      isExpired = true;
    }
    
    return isExpired;
  } 

  async function save(file) {
    const fileContent = await fs.promises.readFile(getOriginalName(file));
    const ContentType = mime.getType(getOriginalName(file)) || undefined;

    try {
      await client.send(new PutObjectCommand({
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

    await unlinkLocalCopy(file);
  }

  // Private
  async function get(file) {
    return await axiosClient.get(file);
  }

  async function unlinkLocalCopy(file) {    
    try {
      await fs.promises.unlink(getOriginalName(file));
    }
    catch(e) {
      console.error("Error: Not able delete screenshot file from /tmp directory (in disk)", e);
      throw new Error('[my-cli-browser] AWS S3 Error', e);
    }
  }

  function getOriginalName(file ) {
    return path.resolve(__dirname,'..', '..', 'tmp', file);
  }


  return {
    shouldSalve,
    save,
  }
}
