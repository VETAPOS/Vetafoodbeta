import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcryptjs';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePinDto } from './dto/update-pin.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPermissions() {
    return this.prisma.permission.findMany({ orderBy: { code: 'asc' } });
  }

  async getRoles(companyId: string) {
    const roles = await this.prisma.companyRole.findMany({ where: { companyId } });
    return Promise.all(roles.map((role) => this.buildRoleWithPermissions(role)));
  }

  async getRole(companyId: string, roleId: string) {
    const role = await this.prisma.companyRole.findFirst({ where: { id: roleId, companyId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return this.buildRoleWithPermissions(role);
  }

  async updateRole(companyId: string, roleId: string, dto: UpdateRoleDto) {
    const role = await this.getRole(companyId, roleId);
    await this.prisma.companyRole.update({
      where: { id: roleId },
      data: { name: dto.name ?? role.name },
    });

    if (dto.permissionIds) {
      if (role.name === 'Admin' && !dto.permissionIds.includes(await this.ensureSettingsAccessPermission())) {
        throw new BadRequestException('Admin role must retain settings.access');
      }

      await this.prisma.companyRolePermission.deleteMany({ where: { companyRoleId: roleId } });
      const createData = dto.permissionIds.map((permissionId) => ({
        companyRoleId: roleId,
        permissionId,
      }));
      if (createData.length) {
        await this.prisma.companyRolePermission.createMany({ data: createData, skipDuplicates: true });
      }
    }

    return this.getRole(companyId, roleId);
  }

  async getUsers(companyId: string) {
    const users = await this.prisma.user.findMany({ where: { companyId } });
    return Promise.all(users.map((user) => this.buildUserWithPermissions(user)));
  }

  async getUser(companyId: string, userId: string) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, companyId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.buildUserWithPermissions(user);
  }

  async updateUser(companyId: string, userId: string, dto: UpdateUserDto) {
    const user = await this.getUser(companyId, userId);

    if (user.email === 'admin@veta.dev' && dto.roleId && user.roleId !== dto.roleId) {
      throw new BadRequestException('Default admin role cannot be changed');
    }

    const data: any = {};
    if (dto.email) {
      data.email = dto.email;
    }
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }
    if (dto.roleId !== undefined) {
      data.roleId = dto.roleId;
    }
    if (dto.pinEnabled !== undefined) {
      data.pinEnabled = dto.pinEnabled;
    }

    await this.prisma.user.update({ where: { id: userId }, data });

    if (dto.grantPermissionIds) {
      await this.prisma.userPermissionGrant.deleteMany({ where: { userId } });
      const rows = dto.grantPermissionIds.map((permissionId) => ({ userId, permissionId }));
      if (rows.length) {
        await this.prisma.userPermissionGrant.createMany({ data: rows, skipDuplicates: true });
      }
    }

    if (dto.denyPermissionIds) {
      await this.prisma.userPermissionDeny.deleteMany({ where: { userId } });
      const rows = dto.denyPermissionIds.map((permissionId) => ({ userId, permissionId }));
      if (rows.length) {
        await this.prisma.userPermissionDeny.createMany({ data: rows, skipDuplicates: true });
      }
    }

    return this.getUser(companyId, userId);
  }

  async updateUserPin(companyId: string, userId: string, dto: UpdatePinDto) {
    const user = await this.getUser(companyId, userId);
    const pin = dto.pin || this.generatePin();

    const conflictingUsers = await this.prisma.user.findMany({
      where: { companyId, pinHash: { not: null }, id: { not: userId } },
      select: { id: true, pinHash: true },
    });

    for (const candidate of conflictingUsers) {
      if (candidate.pinHash && (await bcrypt.compare(pin, candidate.pinHash))) {
        throw new BadRequestException('PIN already in use for this company');
      }
    }

    const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { pinHash, pinEnabled: true, pinUpdatedAt: new Date() },
    });

    return { pin, user: await this.getUser(companyId, userId) };
  }

  async computeEffectivePermissions(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return [] as string[];
    }

    const rolePermissions = await this.prisma.companyRolePermission.findMany({
      where: { companyRoleId: user.roleId || '' },
    });
    const rolePermissionIds = rolePermissions.map((p) => p.permissionId);

    const grants = await this.prisma.userPermissionGrant.findMany({ where: { userId } });
    const denies = await this.prisma.userPermissionDeny.findMany({ where: { userId } });
    const permissionRecords = await this.prisma.permission.findMany({
      where: { id: { in: [...rolePermissionIds, ...grants.map((g) => g.permissionId), ...denies.map((d) => d.permissionId)] } },
    });

    const codeById = new Map(permissionRecords.map((p) => [p.id, p.code] as const));
    const codes = new Set<string>();

    rolePermissionIds.forEach((id) => {
      const code = codeById.get(id);
      if (code) {
        codes.add(code);
      }
    });
    grants.forEach((grant) => {
      const code = codeById.get(grant.permissionId);
      if (code) {
        codes.add(code);
      }
    });
    denies.forEach((deny) => {
      const code = codeById.get(deny.permissionId);
      if (code) {
        codes.delete(code);
      }
    });

    return Array.from(codes);
  }

  private async buildRoleWithPermissions(role: { id: string; name: string; companyId: string }) {
    const rolePermissions = await this.prisma.companyRolePermission.findMany({ where: { companyRoleId: role.id } });
    const permissionRecords = await this.prisma.permission.findMany({ where: { id: { in: rolePermissions.map((rp) => rp.permissionId) } } });
    return { ...role, permissions: permissionRecords };
  }

  private async buildUserWithPermissions(user: { id: string; email: string; companyId: string; roleId: string | null; pinEnabled: boolean }) {
    const [role, grants, denies, permissions] = await Promise.all([
      user.roleId ? this.prisma.companyRole.findUnique({ where: { id: user.roleId } }) : null,
      this.prisma.userPermissionGrant.findMany({ where: { userId: user.id } }),
      this.prisma.userPermissionDeny.findMany({ where: { userId: user.id } }),
      this.computeEffectivePermissions(user.id),
    ]);

    return {
      ...user,
      role,
      grantPermissionIds: grants.map((g) => g.permissionId),
      denyPermissionIds: denies.map((d) => d.permissionId),
      effectivePermissions: permissions,
    };
  }

  private generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async ensureSettingsAccessPermission() {
    const permission = await this.prisma.permission.findUnique({ where: { code: 'settings.access' } });
    if (!permission) {
      const created = await this.prisma.permission.create({ data: { code: 'settings.access', name: 'Ajustes', module: 'settings' } });
      return created.id;
    }
    return permission.id;
  }
}
