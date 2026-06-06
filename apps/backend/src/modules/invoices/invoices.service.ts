import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import { PdfService } from '../../common/services/pdf.service';
import { CreateInvoiceDto, PayInvoiceDto } from './dtos/invoice.dto';
import { generateInvoiceNumber } from '@vendorbridge/shared';

@Injectable()
export class InvoicesService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private emailService: EmailService,
    private pdfService: PdfService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto, userId: string) {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { id: createInvoiceDto.poId },
      include: { vendor: true, items: true },
    });

    if (!po) {
      throw new NotFoundException('Purchase Order not found');
    }

    const invoiceNumber = generateInvoiceNumber(Date.now() % 100000);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days net

    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber,
        poId: po.id,
        vendorId: po.vendorId,
        status: 'ISSUED',
        totalAmount: po.totalAmount,
        taxAmount: po.taxAmount,
        finalAmount: po.finalAmount,
        invoiceDate: new Date(),
        dueDate,
        items: {
          createMany: {
            data: po.items.map((item) => ({
              poItemId: item.id,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              tax: item.tax,
              total: item.total,
            })),
          },
        },
      },
      include: {
        items: true,
        vendor: true,
      },
    });

    // Generate PDF and send email
    await this.emailService.sendInvoiceEmail(
      po.vendor.email,
      invoiceNumber,
      po.vendor.name,
    );

    await this.auditService.log(userId, 'CREATE', 'Invoice', invoice.id);

    return invoice;
  }

  async getInvoiceById(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        items: true,
        vendor: true,
        po: true,
        payments: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async getAllInvoices(skip: number = 0, take: number = 20, filters?: any) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.vendorId) {
      where.vendorId = filters.vendorId;
    }

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        skip,
        take,
        include: {
          items: true,
          vendor: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async payInvoice(invoiceId: string, payInvoiceDto: PayInvoiceDto, userId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { vendor: true },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        vendorId: invoice.vendorId,
        amount: invoice.finalAmount,
        method: payInvoiceDto.paymentMethod as any,
        transactionId: payInvoiceDto.transactionId,
        status: 'COMPLETED',
        paymentDate: new Date(),
        remarks: payInvoiceDto.remarks,
      },
    });

    // Update invoice status
    const updated = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidDate: new Date(),
      },
      include: {
        items: true,
        vendor: true,
        payments: true,
      },
    });

    await this.auditService.log(userId, 'PAYMENT_RECEIVED', 'Invoice', invoiceId, {
      amount: invoice.finalAmount,
      method: payInvoiceDto.paymentMethod,
    });

    return updated;
  }
}
