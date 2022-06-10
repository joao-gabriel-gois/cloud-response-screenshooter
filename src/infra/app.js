import express from 'express';

import { GetUrlScreenshotController } from "../useCases/GetUrlScreenshotController.js";

const getUrlScreenshotController = GetUrlScreenshotController();

const app = express();
app.get('/get-screenshot/:url', getUrlScreenshotController.store);

export { app };
