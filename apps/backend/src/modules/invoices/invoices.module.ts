import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import { PdfService } from '../../common/services/pdf.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, AuditService, EmailService, PdfService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
