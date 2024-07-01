import { registerAs } from '@nestjs/config';

export default registerAs('tinify', () => {
  return {
    tinifyApiKey: process.env.TINIFY_API_KEY,
    baseUrl: process.env.BASE_URL,
  };
});
