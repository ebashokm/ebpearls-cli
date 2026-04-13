import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionHelperSerivce } from './permission.helper';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionHelperService: PermissionHelperSerivce,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required, allow access
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    if (!user?.roles) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasPermission = await this.permissionHelperService.hasPermission(
      user.roles,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException('User has no permission');
    }

    return true;
  }
}
