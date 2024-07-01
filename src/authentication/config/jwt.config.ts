import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    tokenTtl: parseInt(process.env.JWT_TOKEN_TTL ?? '2400', 10),
  };
});
