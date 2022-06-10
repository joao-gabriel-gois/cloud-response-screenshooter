import { GetUrlScreenshotUseCase } from "./GetUrlScreenshotUseCase.js";
import { getServiceName } from '../utils/getServiceName.js';

const getUrlScreenshotUseCase = GetUrlScreenshotUseCase();

export const GetUrlScreenshotController = () => {
  const store = async (request, response) => {
    const { url } = request.params;    
    
    const serviceName = getServiceName(url);
    const S3_BASE_URL = process.env.AWS_BUCKET_URL;

    try {
      await getUrlScreenshotUseCase.execute(url);
      return response.status(200).json({
        updated: true,
        img_url: `${S3_BASE_URL}/image-sample-${serviceName}.png`, 
      });
    }
    catch (e) {
      return response.status(400).json({
        updated: false,
        reason: `${e}`,
      });
    }
  }

  return { 
    store
  };
}