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
import { VendorsService } from './vendors.service';
import { CreateVendorDto, UpdateVendorDto, CreateVendorContactDto } from './dtos/vendor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Vendors')
@Controller('api/vendors')
export class VendorsController {
  constructor(private vendorsService: VendorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new vendor' })
  async createVendor(@Body() createVendorDto: CreateVendorDto, @Req() req: any) {
    return this.vendorsService.createVendor(createVendorDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'List all vendors' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  async getAllVendors(
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '20',
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
    const filters = { search, category };

    return this.vendorsService.getAllVendors(skip, take, filters);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get vendor by ID' })
  async getVendor(@Param('id') id: string) {
    return this.vendorsService.getVendorById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update vendor' })
  async updateVendor(
    @Param('id') id: string,
    @Body() updateVendorDto: UpdateVendorDto,
    @Req() req: any,
  ) {
    return this.vendorsService.updateVendor(id, updateVendorDto, req.user.id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Deactivate vendor' })
  async deactivateVendor(@Param('id') id: string, @Req() req: any) {
    return this.vendorsService.deactivateVendor(id, req.user.id);
  }

  @Post(':id/contacts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Add vendor contact' })
  async addContact(
    @Param('id') id: string,
    @Body() createContactDto: CreateVendorContactDto,
  ) {
    return this.vendorsService.addVendorContact(id, createContactDto);
  }

  @Get(':id/contacts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get vendor contacts' })
  async getContacts(@Param('id') id: string) {
    return this.vendorsService.getVendorContacts(id);
  }
}
