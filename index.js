import 'dotenv/config';
import express from 'express';

import { script } from "./src/script.js";

// await script();
// console.log('Done!');

const S3_BASE_URL = process.env.AWS_BUCKET_URL;

console.log(S3_BASE_URL);

const app = express();

app.get('/update/:url', async (request, response) => {
    const { url } = request.params;    
    const serviceName =  (
      url.split('.')[1]
        ? url.split('.')[0] + '-' + url.split('.')[1]
        : url.split('.')[0]
    );
	
    try {
      await script(url);
      return response.status(200).json({
        updated: true,
        img_url: `${S3_BASE_URL}/image-sample-${serviceName}.png`, 
      });
    }
    catch (e) {
      return response.status(400).json({
        updated: false,
	reason: e,
      });
    }
});

app.listen(process.env.PORT, () => console.log("server is on"));
