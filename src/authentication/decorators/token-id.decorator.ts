import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_TOKEN_KEY } from '../authentication.constants';

export const TokenId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request[REQUEST_TOKEN_KEY]?.sub ?? '';
  },
);
