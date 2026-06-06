import { IsString, IsNumber, IsArray, IsOptional, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePOItemDto {
  @ApiProperty()
  @IsString()
  rfqItemId: string;

  @ApiProperty({ example: 'Server - Dell PowerEdge R750' })
  @IsString()
  productName: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 400000 })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({ example: 8 })
  @IsNumber()
  tax: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsString()
  quotationId: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @ApiProperty({ type: [CreatePOItemDto] })
  @IsArray()
  items: CreatePOItemDto[];
}

export class IssuePODto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  issueDate: Date;
}
