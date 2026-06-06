import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { PurchaseOrderService } from './purchase-order.service';
import { CreatePurchaseOrderDto, IssuePODto } from './dtos/purchase-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Purchase Orders')
@Controller('api/purchase-orders')
export class PurchaseOrderController {
  constructor(private poService: PurchaseOrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create purchase order from quotation' })
  async createPO(@Body() createPODto: CreatePurchaseOrderDto, @Req() req: any) {
    return this.poService.createPurchaseOrder(createPODto, req.user.id);
  }

  @Patch(':id/issue')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Issue purchase order' })
  async issuePO(
    @Param('id') id: string,
    @Body() issueDto: IssuePODto,
    @Req() req: any,
  ) {
    return this.poService.issuePurchaseOrder(id, req.user.id, issueDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get purchase order by ID' })
  async getPO(@Param('id') id: string) {
    return this.poService.getPurchaseOrderById(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List purchase orders' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'vendorId', required: false, type: String })
  async getAllPOs(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
    @Query('status') status?: string,
    @Query('vendorId') vendorId?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
    const filters = { status, vendorId };

    return this.poService.getAllPurchaseOrders(skip, take, filters);
  }
}
