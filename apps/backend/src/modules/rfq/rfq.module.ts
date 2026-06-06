import { Module } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { RfqController } from './rfq.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';

@Module({
  controllers: [RfqController],
  providers: [RfqService, PrismaService, AuditService, EmailService],
  exports: [RfqService],
})
export class RfqModule {}
