import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [VendorsController],
  providers: [VendorsService, PrismaService, AuditService],
  exports: [VendorsService],
})
export class VendorsModule {}
