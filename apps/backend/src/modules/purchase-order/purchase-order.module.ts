import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import { PdfService } from '../../common/services/pdf.service';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PrismaService, AuditService, EmailService, PdfService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
