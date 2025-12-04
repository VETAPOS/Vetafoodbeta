import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';

async function ensureBootstrapData(prisma: PrismaClient) {
  const companies = await prisma.company.count();
  if (companies === 0) {
    const password = await bcrypt.hash('Admin1234*', 10);
    const permission = await prisma.permission.create({
      data: { code: 'settings.access', name: 'Ajustes', module: 'settings' },
    });
    const company = await prisma.company.create({ data: { name: 'DevCompany' } });
    const role = await prisma.companyRole.create({
      data: { name: 'Admin', companyId: company.id },
    });
    await prisma.companyRolePermission.create({
      data: { companyRoleId: role.id, permissionId: permission.id },
    });
    await prisma.user.create({
      data: {
        email: 'admin@veta.dev',
        password,
        companyId: company.id,
        roleId: role.id,
        pinEnabled: false,
      },
    });
  }
}

async function bootstrap() {
  const prismaBootstrapClient = new PrismaClient();
  await prismaBootstrapClient.$connect();
  await ensureBootstrapData(prismaBootstrapClient);
  await prismaBootstrapClient.$disconnect();

  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] });
  app.enableCors({ origin: 'http://localhost:5173' });
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}

bootstrap();
