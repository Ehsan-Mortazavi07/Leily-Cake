import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    // const role = this.reflector.getAllAndOverride('role', [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);

    const { user } = context.switchToHttp().getRequest();

    if(user.isAdmin===false){
      throw new UnauthorizedException('salam')
    }


    return true
  }
}
