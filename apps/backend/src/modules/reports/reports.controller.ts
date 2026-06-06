import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Reports')
@Controller('api/reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('vendor-performance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get vendor performance report' })
  async getVendorPerformance() {
    return this.reportsService.getVendorPerformanceReport();
  }

  @Get('procurement')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get procurement report' })
  @ApiQuery({ name: 'startDate', type: Date })
  @ApiQuery({ name: 'endDate', type: Date })
  async getProcurementReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getProcurementReport(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get invoice report' })
  async getInvoiceReport() {
    return this.reportsService.getInvoiceReport();
  }

  @Get('category-spend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get spending by category' })
  async getCategorySpend() {
    return this.reportsService.getCategorySpendReport();
  }
}
