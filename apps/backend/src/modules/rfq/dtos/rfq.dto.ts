import { IsString, IsNumber, IsArray, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRFQItemDto {
  @ApiProperty({ example: 'Server - Dell PowerEdge R750' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 'Dual socket Xeon processor' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'Units' })
  @IsString()
  unit: string;

  @ApiProperty({ example: 450000, required: false })
  @IsOptional()
  @IsNumber()
  estimatedPrice?: number;
}

export class CreateRFQDto {
  @ApiProperty({ example: 'Request for Server Hardware' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'We need high-performance servers' })
  @IsString()
  description: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  deadlineDate: Date;

  @ApiProperty({ type: [CreateRFQItemDto] })
  @IsArray()
  items: CreateRFQItemDto[];

  @ApiProperty({ type: [String] })
  @IsArray()
  vendorIds: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  attachmentUrls?: string[];
}

export class UpdateRFQDto extends PartialType(CreateRFQDto) {}

export class PublishRFQDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  publishDate: Date;
}
