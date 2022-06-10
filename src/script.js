import path from 'path';
import puppeteer from 'puppeteer';

import { getCurrentDirname } from './utils/path.js';
import S3StorageProvider from './providers/S3StorageProvider.js';


const __dirname = getCurrentDirname(import.meta.url);

const s3Storage = new S3StorageProvider();

export const script  = async (url) => {
  let browser, page;
  try {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  }
  catch(e) {
    console.error('Error: Not able to launch our create new page in browser', e);
  }
  const serviceName = (
    url.split('.')[1]
      ? url.split('.')[0] + '-' + url.split('.')[1]
      : url.split('.')[0]
  );

  url = 'https://' + url;
  // calling staging url and getting screenshot
  try {
    await page.goto(url);
;
    await page.screenshot({
      path: path.resolve(__dirname, '..', 'tmp', `image-sample-${serviceName}.png`)
    });
  }
  catch(e) {
    console.error(`Error: Not able to go or or take screenshot for ${url}`, e);
  }

  try {
    await s3Storage.save(`image-sample-${serviceName}.png`);
  }
  catch(e) {
    console.error("Error: Not able save one of the/both screenshots\n\n", e);
  }

  await browser.close();
};


