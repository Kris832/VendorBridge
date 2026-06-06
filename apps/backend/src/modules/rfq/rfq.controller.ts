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
import { RfqService } from './rfq.service';
import { CreateRFQDto, UpdateRFQDto, PublishRFQDto } from './dtos/rfq.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('RFQ')
@Controller('api/rfq')
export class RfqController {
  constructor(private rfqService: RfqService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new RFQ' })
  async createRFQ(@Body() createRFQDto: CreateRFQDto, @Req() req: any) {
    return this.rfqService.createRFQ(createRFQDto, req.user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Publish RFQ to vendors' })
  async publishRFQ(
    @Param('id') id: string,
    @Body() publishRFQDto: PublishRFQDto,
    @Req() req: any,
  ) {
    return this.rfqService.publishRFQ(id, req.user.id, publishRFQDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all RFQs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  async getAllRFQs(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
    const filters = { status, search };

    return this.rfqService.getAllRFQs(skip, take, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get RFQ by ID' })
  async getRFQ(@Param('id') id: string) {
    return this.rfqService.getRFQById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update RFQ' })
  async updateRFQ(
    @Param('id') id: string,
    @Body() updateRFQDto: UpdateRFQDto,
    @Req() req: any,
  ) {
    return this.rfqService.updateRFQ(id, updateRFQDto, req.user.id);
  }
}
