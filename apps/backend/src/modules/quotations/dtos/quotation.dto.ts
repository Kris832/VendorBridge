import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateQuotationItemDto {
  @ApiProperty()
  @IsString()
  rfqItemId: string;

  @ApiProperty({ example: 400000 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 8 })
  @IsNumber()
  tax: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  discount?: number;
}

export class CreateQuotationDto {
  @ApiProperty()
  @IsString()
  rfqId: string;

  @ApiProperty({ type: [CreateQuotationItemDto] })
  @IsArray()
  items: CreateQuotationItemDto[];

  @ApiProperty({ example: 'Net 30', required: false })
  @IsOptional()
  @IsString()
  paymentTerms?: string;

  @ApiProperty({ example: 30, required: false })
  @IsOptional()
  @IsNumber()
  deliveryDays?: number;
}

export class UpdateQuotationDto extends PartialType(CreateQuotationDto) {}

export class SubmitQuotationDto {
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  attachmentUrls?: string[];
}

export class ApproveQuotationDto {
  @ApiProperty({ example: 4.5 })
  @IsNumber()
  score: number;
}

export class RejectQuotationDto {
  @ApiProperty({ example: 'Price is too high' })
  @IsString()
  reason: string;
}
