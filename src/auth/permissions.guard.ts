import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permissions.decorator';
import { SettingsService } from '../modules/settings/settings.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private settingsService: SettingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Missing user');
    }

    const permissions = await this.settingsService.computeEffectivePermissions(user.id);
    const allowed = required.every((perm) => permissions.includes(perm));
    if (!allowed) {
      throw new UnauthorizedException('Insufficient permissions');
    }
    return true;
  }
}
