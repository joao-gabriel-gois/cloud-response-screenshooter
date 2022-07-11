import { S3StorageProvider} from '../providers/S3StorageProvider.js';
import PuppeteerBrowserProvider from '../providers/PuppeteerBrowserProvider.js';
import { getServiceName } from '../utils/getServiceName.js';

const s3Storage = S3StorageProvider();
const puppeteerBrowser = new PuppeteerBrowserProvider();

// 3 WEEKS IMAGE TTL
const IMAGE_VERSION_TTL_IN_SECONDS = 3 * 7 * 24 * 60 * 60;

export const GetUrlScreenshotUseCase = (storage = s3Storage) => {
  const execute = async (url) => {
    // Need to update useCase to stop returning a boolean to controller
    const serviceName = getServiceName(url);
    const shouldSave = await storage.shouldSalve(
      `image-sample-${serviceName}.png`,
      IMAGE_VERSION_TTL_IN_SECONDS
    );

    if (shouldSave) {
      await puppeteerBrowser.launch();
      await puppeteerBrowser.takeScreenshot(url);
      await puppeteerBrowser.close();
      
      await storage.save(`image-sample-${serviceName}.png`);
    }

    return shouldSave;
    
  };

  return {
    execute,
  };
}

