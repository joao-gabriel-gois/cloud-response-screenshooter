import 'dotenv/config';
import { app } from './app.js';

//const S3_BASE_URL = process.env.AWS_BUCKET_URL;
//console.log(S3_BASE_URL);

export default () => {
  app.listen(process.env.PORT, () => {
    console.log("[my-cli-browser] Started! Running...");
  });
}