import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getVendorPerformanceReport() {
    const vendors = await this.prisma.vendor.findMany({
      include: {
        quotations: true,
        purchaseOrders: true,
      },
    });

    return vendors.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      rating: vendor.rating,
      category: vendor.category,
      quotationCount: vendor.quotations.length,
      poCount: vendor.purchaseOrders.length,
    }));
  }

  async getProcurementReport(startDate: Date, endDate: Date) {
    const rfqs = await this.prisma.rFQ.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        quotations: true,
        purchaseOrders: true,
      },
    });

    const totalAmount = rfqs.reduce((sum, rfq) => {
      return (
        sum +
        rfq.purchaseOrders.reduce((poSum, po) => poSum + po.finalAmount, 0)
      );
    }, 0);

    return {
      totalRFQs: rfqs.length,
      totalQuotations: rfqs.reduce((sum, rfq) => sum + rfq.quotations.length, 0),
      totalPOs: rfqs.reduce((sum, rfq) => sum + rfq.purchaseOrders.length, 0),
      totalSpend: totalAmount,
      period: { startDate, endDate },
    };
  }

  async getInvoiceReport() {
    const [paidInvoices, overdueInvoices, draftInvoices] = await Promise.all([
      this.prisma.invoice.count({ where: { status: 'PAID' } }),
      this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      this.prisma.invoice.count({ where: { status: 'DRAFT' } }),
    ]);

    const paidAmount = await this.prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { finalAmount: true },
    });

    const overdueAmount = await this.prisma.invoice.aggregate({
      where: { status: 'OVERDUE' },
      _sum: { finalAmount: true },
    });

    return {
      paidInvoices,
      overdueInvoices,
      draftInvoices,
      paidAmount: paidAmount._sum?.finalAmount || 0,
      overdueAmount: overdueAmount._sum?.finalAmount || 0,
    };
  }

  async getCategorySpendReport() {
    const vendors = await this.prisma.vendor.findMany({
      select: {
        category: true,
        purchaseOrders: {
          select: {
            finalAmount: true,
          },
        },
      },
    });

    const categorySpend = vendors.reduce(
      (acc, vendor) => {
        const spend = vendor.purchaseOrders.reduce((sum, po) => sum + po.finalAmount, 0);
        if (!acc[vendor.category]) {
          acc[vendor.category] = 0;
        }
        acc[vendor.category] += spend;
        return acc;
      },
      {} as Record<string, number>,
    );

    return categorySpend;
  }
}
