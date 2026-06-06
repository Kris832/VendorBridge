import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { AuditService } from '../../common/services/audit.service';
import { CreateVendorDto, UpdateVendorDto, CreateVendorContactDto } from './dtos/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async createVendor(createVendorDto: CreateVendorDto, userId: string) {
    // Check if vendor with same GST or PAN already exists
    const existingVendor = await this.prisma.vendor.findFirst({
      where: {
        OR: [
          { gstNumber: createVendorDto.gstNumber },
          { panNumber: createVendorDto.panNumber },
        ],
      },
    });

    if (existingVendor) {
      throw new BadRequestException('Vendor with this GST or PAN already exists');
    }

    const vendor = await this.prisma.vendor.create({
      data: {
        userId: userId,
        name: createVendorDto.name,
        email: createVendorDto.email,
        phone: createVendorDto.phone,
        website: createVendorDto.website,
        gstNumber: createVendorDto.gstNumber,
        panNumber: createVendorDto.panNumber,
        category: createVendorDto.category as any,
        addressLine1: createVendorDto.addressLine1,
        addressLine2: createVendorDto.addressLine2,
        city: createVendorDto.city,
        state: createVendorDto.state,
        postalCode: createVendorDto.postalCode,
        country: createVendorDto.country,
        bankName: createVendorDto.bankName,
        bankAccountNo: createVendorDto.bankAccountNo,
        ifscCode: createVendorDto.ifscCode,
      },
    });

    await this.auditService.log(userId, 'CREATE', 'Vendor', vendor.id);

    return vendor;
  }

  async getVendorById(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        contacts: true,
        documents: true,
      },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async getAllVendors(skip: number = 0, take: number = 20, filters?: any) {
    const where: any = { isActive: true };

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { gstNumber: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [vendors, total] = await Promise.all([
      this.prisma.vendor.findMany({
        where,
        skip,
        take,
        include: {
          contacts: true,
          documents: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.vendor.count({ where }),
    ]);

    return {
      data: vendors,
      pagination: {
        total,
        page: Math.floor(skip / take) + 1,
        pageSize: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateVendor(vendorId: string, updateVendorDto: UpdateVendorDto, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updated = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: updateVendorDto,
    });

    await this.auditService.log(userId, 'UPDATE', 'Vendor', vendorId, updateVendorDto);

    return updated;
  }

  async deactivateVendor(vendorId: string, userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const updated = await this.prisma.vendor.update({
      where: { id: vendorId },
      data: { isActive: false },
    });

    await this.auditService.log(userId, 'UPDATE', 'Vendor', vendorId, { isActive: false });

    return updated;
  }

  async addVendorContact(vendorId: string, createContactDto: CreateVendorContactDto) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const contact = await this.prisma.vendorContact.create({
      data: {
        vendorId,
        name: createContactDto.name,
        email: createContactDto.email,
        phone: createContactDto.phone,
        role: createContactDto.role,
        isPrimary: createContactDto.isPrimary || false,
      },
    });

    return contact;
  }

  async getVendorContacts(vendorId: string) {
    return this.prisma.vendorContact.findMany({
      where: { vendorId },
    });
  }

  async updateVendorRating(vendorId: string, rating: number) {
    return this.prisma.vendor.update({
      where: { id: vendorId },
      data: { rating },
    });
  }
}
