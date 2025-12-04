import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma.service';
import { SettingsService } from '../modules/settings/settings.service';
import { AuthGuard } from './auth.guard';

interface ApproveActionDto {
  pin: string;
  action: string;
  context?: Record<string, any>;
}

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly settingsService: SettingsService) {}

  @Get('me')
  async getSession(@Req() req: any) {
    const user = await this.settingsService.getUser(req.user.companyId, req.user.id);
    const effectivePermissions = await this.settingsService.computeEffectivePermissions(req.user.id);
    return { ...user, effectivePermissions };
  }

  @Post('approve-action')
  async approveAction(@Req() req: any, @Body() body: ApproveActionDto) {
    const { pin, action } = body;
    const requester = req.user;
    const users = await this.prisma.user.findMany({
      where: { companyId: requester.companyId, pinHash: { not: null }, pinEnabled: true },
      select: { id: true, pinHash: true },
    });

    let approver: { id: string } | null = null;
    for (const user of users) {
      if (user.pinHash && (await bcrypt.compare(pin, user.pinHash))) {
        approver = { id: user.id };
        break;
      }
    }

    if (!approver) {
      throw new UnauthorizedException('Invalid PIN');
    }

    const permissions = await this.settingsService.computeEffectivePermissions(approver.id);
    if (!permissions.includes(action)) {
      throw new UnauthorizedException('Approver lacks permission');
    }

    console.log('Action override recorded', {
      action,
      approverUserId: approver.id,
      requestedBy: requester.id,
      context: body.context || {},
    });

    return { ok: true, approverUserId: approver.id, action };
  }
}
