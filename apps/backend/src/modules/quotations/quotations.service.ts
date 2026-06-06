import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { CreateQuotationDto, UpdateQuotationDto, SubmitQuotationDto, ApproveQuotationDto, RejectQuotationDto } from './dtos/quotation.dto';
import { generateQuotationNumber } from '@vendorbridge/shared';

@Injectable()
export class QuotationsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async createQuotation(createQuotationDto: CreateQuotationDto, vendorId: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: createQuotationDto.rfqId },
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    // Check if vendor already submitted quotation
    const existingQuotation = await this.prisma.quotation.findFirst({
      where: {
        rfqId: createQuotationDto.rfqId,
        vendorId,
      },
    });

    if (existingQuotation) {
      throw new BadRequestException('Quotation already submitted for this RFQ');
    }

    const quotationNumber = generateQuotationNumber(Date.now() % 100000);
    let totalAmount = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    const items = createQuotationDto.items.map((item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const taxAmount = (itemTotal * item.tax) / 100;
      const discountAmount = (itemTotal * (item.discount || 0)) / 100;

      totalAmount += itemTotal;
      totalTax += taxAmount;
      totalDiscount += discountAmount;

      return {
        ...item,
        total: itemTotal + taxAmount - discountAmount,
      };
    });

    const finalAmount = totalAmount + totalTax - totalDiscount;

    const quotation = await this.prisma.quotation.create({
      data: {
        quotationNumber,
        rfqId: createQuotationDto.rfqId,
        vendorId,
        status: 'DRAFT',
        totalAmount,
        taxAmount: totalTax,
        discountAmount: totalDiscount,
        finalAmount,
        deliveryDays: createQuotationDto.deliveryDays,
        paymentTerms: createQuotationDto.paymentTerms,
        items: {
          createMany: {
            data: items,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return quotation;
  }

  async submitQuotation(quotationId: string, vendorId: string, submitQuotationDto: SubmitQuotationDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (quotation.vendorId !== vendorId) {
      throw new BadRequestException('Unauthorized');
    }

    if (quotation.status !== 'DRAFT') {
      throw new BadRequestException('Only draft quotations can be submitted');
    }

    const updated = await this.prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    await this.auditService.log(vendorId, 'SUBMIT', 'Quotation', quotationId);

    return updated;
  }

  async getQuotationById(quotationId: string) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
      include: {
        items: true,
        vendor: true,
        rfq: true,
      },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    return quotation;
  }

  async getQuotationsByRFQ(rfqId: string, skip: number = 0, take: number = 20) {
    const [quotations, total] = await Promise.all([
      this.prisma.quotation.findMany({
        where: { rfqId },
        skip,
        take,
        include: {
          items: true,
          vendor: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quotation.count({ where: { rfqId } }),
    ]);

    return {
      data: quotations,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async approveQuotation(quotationId: string, userId: string, approveQuotationDto: ApproveQuotationDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    if (quotation.status !== 'SUBMITTED') {
      throw new BadRequestException('Only submitted quotations can be approved');
    }

    const updated = await this.prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'APPROVED',
        score: approveQuotationDto.score,
        reviewedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    await this.auditService.log(userId, 'APPROVE', 'Quotation', quotationId);

    return updated;
  }

  async rejectQuotation(quotationId: string, userId: string, rejectQuotationDto: RejectQuotationDto) {
    const quotation = await this.prisma.quotation.findUnique({
      where: { id: quotationId },
    });

    if (!quotation) {
      throw new NotFoundException('Quotation not found');
    }

    const updated = await this.prisma.quotation.update({
      where: { id: quotationId },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectQuotationDto.reason,
        reviewedAt: new Date(),
      },
    });

    await this.auditService.log(userId, 'REJECT', 'Quotation', quotationId, { reason: rejectQuotationDto.reason });

    return updated;
  }
}
