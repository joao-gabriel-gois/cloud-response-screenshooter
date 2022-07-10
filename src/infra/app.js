import express from 'express';

import { GetUrlScreenshotController } from "../useCases/GetUrlScreenshotController.js";

const getUrlScreenshotController = GetUrlScreenshotController();

const app = express();

//app.get('/media/*', );

app.get('/:url', getUrlScreenshotController.store);

export { app };
