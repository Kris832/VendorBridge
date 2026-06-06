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
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto, UpdateQuotationDto, SubmitQuotationDto, ApproveQuotationDto, RejectQuotationDto } from './dtos/quotation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Quotations')
@Controller('api/quotations')
export class QuotationsController {
  constructor(private quotationsService: QuotationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new quotation (vendor)' })
  async createQuotation(@Body() createQuotationDto: CreateQuotationDto, @Req() req: any) {
    return this.quotationsService.createQuotation(createQuotationDto, req.user.vendorId);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Submit quotation' })
  async submitQuotation(
    @Param('id') id: string,
    @Body() submitQuotationDto: SubmitQuotationDto,
    @Req() req: any,
  ) {
    return this.quotationsService.submitQuotation(id, req.user.vendorId, submitQuotationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get quotation by ID' })
  async getQuotation(@Param('id') id: string) {
    return this.quotationsService.getQuotationById(id);
  }

  @Get('rfq/:rfqId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get quotations for RFQ' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getQuotationsByRFQ(
    @Param('rfqId') rfqId: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
  ) {
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
    return this.quotationsService.getQuotationsByRFQ(rfqId, skip, take);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Approve quotation' })
  async approveQuotation(
    @Param('id') id: string,
    @Body() approveQuotationDto: ApproveQuotationDto,
    @Req() req: any,
  ) {
    return this.quotationsService.approveQuotation(id, req.user.id, approveQuotationDto);
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Reject quotation' })
  async rejectQuotation(
    @Param('id') id: string,
    @Body() rejectQuotationDto: RejectQuotationDto,
    @Req() req: any,
  ) {
    return this.quotationsService.rejectQuotation(id, req.user.id, rejectQuotationDto);
  }
}
