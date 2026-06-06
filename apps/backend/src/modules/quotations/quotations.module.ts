import { Module } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';

@Module({
  controllers: [QuotationsController],
  providers: [QuotationsService, PrismaService, AuditService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
