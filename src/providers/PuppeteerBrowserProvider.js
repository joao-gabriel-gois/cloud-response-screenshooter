import path from 'path';
import puppeteer from 'puppeteer';

import { getCurrentDirname } from '../utils/path.js';

const __dirname = getCurrentDirname(import.meta.url);

export default class PuppeteerBrowserProvider {
  constructor() {
    this.browser;
    this.page;
  }

  async launch() {
    if (!this.browser) {
      try {
        this.browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox'],
        });
      }
      catch(e) {
        console.error('[my-cli-browser] Error: Not able to launch browser', e);
        throw new Error('[my-cli-browser] Error: Not able to launch browser', e);
      }
    }
  }

  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
        this.browser = undefined, this.page = undefined;
      }
      catch(e) {
        console.error('[my-cli-browser] Error while closing browser:', e);
        throw new Error('[my-cli-browser] Error while closing browser', e);  
      }
    }
  }

  async takeScreenshot(url) {
    if (!this.browser) {
      console.error('[my-cli-browser] Error: No browser running!');
      throw new Error('[my-cli-browser] Error: No browser running!');
    }
   
    try {
      if (this.page) await this.page.close();
      this.page = await this.browser.newPage();
    }
    catch(e) {
      console.error('[my-cli-browser] Error: Not able to create new page', e);
      throw new Error('[my-cli-browser] Error: Not able create new page', e);
    }

    const serviceName = (
      url.split('.')[1]
        ? url.split('.')[0] + '-' + url.split('.')[1]
        : url.split('.')[0]
    );
    url = 'https://' + url;
    
    try { await this.page.goto(url) }
    catch(e) {
      console.error(`[my-cli-browser] Error: Not able to got to url ${url}`, e);
      throw new Error(`[my-cli-browser] Error: Not able to go to url ${url}`, e);
    }
    
    try {
      await this.page.screenshot({
        path: path.resolve(__dirname, '..', '..', 'tmp', `image-sample-${serviceName}.png`)
      });
    }
    catch(e) {
      console.error('[my-cli-browser] Error: could not take screenshot', e);
      throw new Error('[my-cli-browser] Error: could not take screenshot', e);
    }
  }
}
