import { S3StorageProvider} from '../providers/S3StorageProvider.js';
import PuppeteerBrowserProvider from '../providers/PuppeteerBrowserProvider.js';
import { getServiceName } from '../utils/getServiceName.js';

const s3Storage = S3StorageProvider();
const puppeteerBrowser = new PuppeteerBrowserProvider();

export const GetUrlScreenshotUseCase = () => {
  const execute = async (url) => {
    const serviceName = getServiceName(url);

    await puppeteerBrowser.launch();
    await puppeteerBrowser.takeScreenshot(url);
    await puppeteerBrowser.close();

    return await s3Storage.checkAndSave(`image-sample-${serviceName}.png`);    
  };

  return {
    execute,
  };
}

