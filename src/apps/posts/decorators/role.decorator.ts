import { SetMetadata } from '@nestjs/common';

export const Roles = (...role: boolean[]) => {
  return SetMetadata('role', role);
};
