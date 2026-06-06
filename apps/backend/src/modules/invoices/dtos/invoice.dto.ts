import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  poId: string;
}

export class PayInvoiceDto {
  @ApiProperty({ enum: ['BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'NET_BANKING', 'UPI'] })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}
