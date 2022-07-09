import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetEntity = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
