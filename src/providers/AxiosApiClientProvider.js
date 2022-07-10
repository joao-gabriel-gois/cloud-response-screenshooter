import axios from 'axios';

const S3_BASE_URL = process.env.AWS_BUCKET_URL;

export class S3AxiosClient {
  constructor() {
    this.client = axios.create({
      baseURL: `${S3_BASE_URL}`,
    })
  }

  async get(path) {
    return await this.client.get(path);
  }

  async post(path, data) {
    return this.client.get(path, data);
  }
}