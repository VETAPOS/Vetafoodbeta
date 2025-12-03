import { Module } from '@nestjs/common';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SettingsModule],
  controllers: [AuthController],
  providers: [PrismaService],
})
export class AppModule {}
