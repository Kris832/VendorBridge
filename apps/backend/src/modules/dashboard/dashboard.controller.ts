import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  async getMetrics(@Req() req: any) {
    return this.dashboardService.getDashboardMetrics(req.user.id);
  }

  @Get('recent-activity')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get recent activity' })
  async getRecentActivity(@Req() req: any) {
    return this.dashboardService.getRecentActivity(req.user.id);
  }

  @Get('vendor-analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get vendor analytics' })
  async getVendorAnalytics() {
    return this.dashboardService.getVendorAnalytics();
  }

  @Get('procurement-trends')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get procurement trends' })
  async getProcurementTrends() {
    return this.dashboardService.getProcurementTrends();
  }
}
