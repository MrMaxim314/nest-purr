import { ExecutionContext } from '@nestjs/common';

export const getUser = (context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const { user } = req;
  return user;
};
