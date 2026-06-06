import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import { PdfService } from '../../common/services/pdf.service';
import { CreatePurchaseOrderDto, IssuePODto } from './dtos/purchase-order.dto';
import { generatePONumber } from '@vendorbridge/shared';

@Injectable()
export class PurchaseOrderService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private emailService: EmailService,
    private pdfService: PdfService,
  ) {}

  async createPurchaseOrder(createPODto: CreatePurchaseOrderDto, userId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: createPODto.quotationId },
      include: { rfq: true, vendor: true },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (quotation.status !== 'APPROVED') {
      throw new BadRequestException('Only approved quotations can be converted to PO');
    }

    const poNumber = generatePONumber(Date.now() % 100000);

    let totalAmount = 0;
    let totalTax = 0;

    const items = createPODto.items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const taxAmount = (itemTotal * item.tax) / 100;

      totalAmount += itemTotal;
      totalTax += taxAmount;

      return {
        ...item,
        total: itemTotal + taxAmount,
      };
    });

    const po = await this.prisma.purchaseOrder.create({
      data: {
        poNumber,
        rfqId: quotation.rfqId,
        quotationId: quotation.id,
        vendorId: quotation.vendorId,
        status: 'DRAFT',
        totalAmount,
        taxAmount: totalTax,
        finalAmount: totalAmount + totalTax,
        issueDate: new Date(),
        deliveryDate: createPODto.deliveryDate,
        items: {
          createMany: {
            data: items,
          },
        },
      },
      include: {
        items: true,
        vendor: true,
      },
    });

    await this.auditService.log(userId, 'CREATE', 'PurchaseOrder', po.id);

    return po;
  }

  async issuePurchaseOrder(poId: string, userId: string, issueDto: IssuePODto) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: { vendor: true, items: true },
    });

    if (!po) {
      throw new NotFoundException('Purchase Order not found');
    }

    if (po.status !== 'DRAFT') {
      throw new BadRequestException('Only draft POs can be issued');
    }

    const updated = await this.prisma.purchaseOrder.update({
      where: { id: poId },
      data: {
        status: 'ISSUED',
        issueDate: issueDto.issueDate,
      },
      include: {
        items: true,
        vendor: true,
      },
    });

    // Generate PDF and send email
    const pdfBuffer = await this.pdfService.generatePOPdf({
      poNumber: updated.poNumber,
      vendorName: updated.vendor.name,
      vendorEmail: updated.vendor.email,
      vendorPhone: updated.vendor.phone,
      deliveryDate: updated.deliveryDate,
      items: updated.items,
      taxAmount: updated.taxAmount,
      finalAmount: updated.finalAmount,
    });

    await this.emailService.sendPOEmail(
      updated.vendor.email,
      updated.poNumber,
      updated.vendor.name,
    );

    await this.auditService.log(userId, 'PUBLISH', 'PurchaseOrder', poId);

    return updated;
  }

  async getPurchaseOrderById(poId: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: poId },
      include: {
        items: true,
        vendor: true,
        rfq: true,
        quotation: true,
        invoices: true,
        receipts: true,
      },
    });

    if (!po) {
      throw new NotFoundException('Purchase Order not found');
    }

    return po;
  }

  async getAllPurchaseOrders(skip: number = 0, take: number = 20, filters?: any) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.vendorId) {
      where.vendorId = filters.vendorId;
    }

    const [pos, total] = await Promise.all([
      this.prisma.purchaseOrder.findMany({
        where,
        skip,
        take,
        include: {
          items: true,
          vendor: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return {
      data: pos,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }
}
