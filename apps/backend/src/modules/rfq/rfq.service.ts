import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { EmailService } from '../../common/services/email.service';
import { CreateRFQDto, UpdateRFQDto, PublishRFQDto } from './dtos/rfq.dto';
import { generateRFQNumber } from '@vendorbridge/shared';

@Injectable()
export class RfqService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private emailService: EmailService,
  ) {}

  async createRFQ(createRFQDto: CreateRFQDto, userId: string) {
    const rfqNumber = generateRFQNumber(Date.now() % 1000000);

    const rfq = await this.prisma.rFQ.create({
      data: {
        rfqNumber,
        title: createRFQDto.title,
        description: createRFQDto.description,
        createdById: userId,
        deadlineDate: createRFQDto.deadlineDate,
        status: 'DRAFT',
        items: {
          createMany: {
            data: createRFQDto.items,
          },
        },
        vendors: {
          connect: createRFQDto.vendorIds.map((id) => ({ id })),
        },
      },
      include: {
        items: true,
        vendors: true,
      },
    });

    await this.auditService.log(userId, 'CREATE', 'RFQ', rfq.id);

    return rfq;
  }

  async publishRFQ(rfqId: string, userId: string, publishRFQDto: PublishRFQDto) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: { vendors: true },
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    if (rfq.status !== 'DRAFT') {
      throw new BadRequestException('Only draft RFQs can be published');
    }

    const updated = await this.prisma.rFQ.update({
      where: { id: rfqId },
      data: {
        status: 'PUBLISHED',
        publishDate: publishRFQDto.publishDate,
      },
      include: {
        items: true,
        vendors: true,
      },
    });

    // Send RFQ emails to vendors
    for (const vendor of rfq.vendors) {
      await this.emailService.sendRFQNotification(
        vendor.email,
        rfq.rfqNumber,
        rfq.title,
        rfq.deadlineDate,
      );
    }

    await this.auditService.log(userId, 'PUBLISH', 'RFQ', rfqId);

    return updated;
  }

  async getRFQById(rfqId: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: {
        items: true,
        vendors: true,
        attachments: true,
        quotations: true,
      },
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    return rfq;
  }

  async getAllRFQs(skip: number = 0, take: number = 20, filters?: any) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { rfqNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [rfqs, total] = await Promise.all([
      this.prisma.rFQ.findMany({
        where,
        skip,
        take,
        include: {
          items: true,
          vendors: true,
          quotations: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.rFQ.count({ where }),
    ]);

    return {
      data: rfqs,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateRFQ(rfqId: string, updateRFQDto: UpdateRFQDto, userId: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: rfqId },
    });

    if (!rfq) {
      throw new NotFoundException('RFQ not found');
    }

    if (rfq.status !== 'DRAFT') {
      throw new BadRequestException('Only draft RFQs can be updated');
    }

    const updated = await this.prisma.rFQ.update({
      where: { id: rfqId },
      data: {
        title: updateRFQDto.title,
        description: updateRFQDto.description,
        deadlineDate: updateRFQDto.deadlineDate,
      },
      include: {
        items: true,
        vendors: true,
      },
    });

    await this.auditService.log(userId, 'UPDATE', 'RFQ', rfqId, updateRFQDto);

    return updated;
  }
}
