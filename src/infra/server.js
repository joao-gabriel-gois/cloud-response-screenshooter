import 'dotenv/config';
import { app } from './app.js';

const { PORT } = process.env;

export default () => {
  app.listen(PORT, () => {
    console.log(`[my-cli-browser] Started! ${PORT ? `Running on PORT ${PORT}` : "NO PORT FOUND, ADD .env FILE!"}`);
    if (!PORT) {
      console.error("NO .env file, process not running on expected PORT!");
      throw new Error("NO .env File", "Server could not start because .env file was not added to running instance");
    }
  });
}
