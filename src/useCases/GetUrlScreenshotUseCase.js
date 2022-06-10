import S3StorageProvider from '../providers/S3StorageProvider.js';
import PuppeteerBrowserProvider from '../providers/PuppeteerBrowserProvider.js';
import { getServiceName } from '../utils/getServiceName.js';

const s3Storage = new S3StorageProvider();
const puppeteerBrowser = new PuppeteerBrowserProvider();

export const GetUrlScreenshotUseCase = () => {
  const execute = async (url) => {
    await puppeteerBrowser.launch();
    await puppeteerBrowser.takeScreenshot(url);
    await puppeteerBrowser.close();

    const serviceName = getServiceName(url);

    await s3Storage.save(`image-sample-${serviceName}.png`);    
  };

  return {
    execute,
  };
}

