import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { PermissionsGuard } from '../../auth/permissions.guard';
import { Permission } from '../../auth/permissions.decorator';
import { SettingsService } from './settings.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePinDto } from './dto/update-pin.dto';

@Controller('settings')
@UseGuards(AuthGuard, PermissionsGuard)
@Permission('settings.access')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('permissions')
  getPermissions() {
    return this.settingsService.getPermissions();
  }

  @Get('roles')
  getRoles(@Req() req: any) {
    return this.settingsService.getRoles(req.user.companyId);
  }

  @Get('roles/:id')
  getRole(@Req() req: any, @Param('id') id: string) {
    return this.settingsService.getRole(req.user.companyId, id);
  }

  @Patch('roles/:id')
  updateRole(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.settingsService.updateRole(req.user.companyId, id, dto);
  }

  @Get('users')
  getUsers(@Req() req: any) {
    return this.settingsService.getUsers(req.user.companyId);
  }

  @Get('users/:id')
  getUser(@Req() req: any, @Param('id') id: string) {
    return this.settingsService.getUser(req.user.companyId, id);
  }

  @Patch('users/:id')
  updateUser(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.settingsService.updateUser(req.user.companyId, id, dto);
  }

  @Post('users/:id/pin')
  setPin(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePinDto) {
    return this.settingsService.updateUserPin(req.user.companyId, id, dto);
  }
}
