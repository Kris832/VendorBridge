import { IsString, IsEmail, IsPhoneNumber, IsOptional, IsUrl, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ example: 'TechSupply Corp' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'vendor@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91-9876543210' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://techsupply.com', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: '18AABCT1234H1Z0' })
  @Matches(/^[0-9A-Z]{15}$/)
  gstNumber: string;

  @ApiProperty({ example: 'ABCPT1234K' })
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
  panNumber: string;

  @ApiProperty({ example: 'MANUFACTURING', enum: ['MANUFACTURING', 'DISTRIBUTION', 'SERVICE', 'CONSULTING', 'LOGISTICS', 'FINANCE', 'IT', 'OTHER'] })
  @IsString()
  category: string;

  @ApiProperty({ example: '123 Tech Park' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Suite 100', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Bangalore' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Karnataka' })
  @IsString()
  state: string;

  @ApiProperty({ example: '560001' })
  @Matches(/^[0-9]{5,6}$/)
  postalCode: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'ICIC Bank', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ example: '1234567890123456', required: false })
  @IsOptional()
  @IsString()
  bankAccountNo?: string;

  @ApiProperty({ example: 'ICIC0000001', required: false })
  @IsOptional()
  @IsString()
  ifscCode?: string;
}

export class UpdateVendorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine1?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateVendorContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@vendor.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91-9876543210' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Procurement Manager' })
  @IsString()
  role: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isPrimary?: boolean;
}
