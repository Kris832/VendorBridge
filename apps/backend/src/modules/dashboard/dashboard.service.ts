import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(userId: string) {
    const [totalVendors, activeRFQs, pendingQuotations, issuedPOs, overdueInvoices] = await Promise.all([
      this.prisma.vendor.count({ where: { isActive: true } }),
      this.prisma.rFQ.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.quotation.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.purchaseOrder.count({ where: { status: 'ISSUED' } }),
      this.prisma.invoice.count({ where: { status: 'OVERDUE' } }),
    ]);

    const totalSpend = await this.prisma.invoice.aggregate({
      where: { status: 'PAID' },
      _sum: { finalAmount: true },
    });

    return {
      totalVendors,
      activeRFQs,
      pendingQuotations,
      issuedPOs,
      overdueInvoices,
      totalSpend: totalSpend._sum?.finalAmount || 0,
    };
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVendorAnalytics() {
    const vendors = await this.prisma.vendor.findMany({
      select: {
        id: true,
        name: true,
        rating: true,
        category: true,
      },
    });

    return vendors;
  }

  async getProcurementTrends(months: number = 6) {
    const trends = await this.prisma.procurementMetrics.findMany({
      take: months,
      orderBy: { periodYear: 'desc', periodMonth: 'desc' },
    });

    return trends;
  }
}
