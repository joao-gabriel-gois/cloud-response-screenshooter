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
  
  // PUBLIC
  async function get(file) {
    return await axiosClient.get(file);
  }

  async function checkAndSave(file, expiryTimeInSeconds =  3 * 7 * 24 * 60 * 60) {// 3 weeks as default expiry time  
    let isExpired = false;
    // Check if s3 fili is there already, if not, it will put there
    try {
      const s3Response = await this.get(file);

      const lastModified = new Date(s3Response.headers["last-modified"]).getTime();
      isExpired = new Date().getTime() / 1000 - lastModified > expiryTimeInSeconds; // modified more than 3 weeks ago?
      
      if (!isExpired) await unlinkLocalCopy(file);
      
      console.log(
        "Last Modified X Today",
        new Date(lastModified).toISOString(),
        `X ${(new Date()).toISOString()}`,
        "\nIs Expired?",
        isExpired
      );
    }
    catch { 
      await save(file);
      return true;
    }

    if (isExpired) await save(file);
    return isExpired;
  }


  // PRIVATE
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
    get,
    checkAndSave,
  }

}
