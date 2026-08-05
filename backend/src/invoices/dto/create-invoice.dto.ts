import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLineItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNotEmpty()
  quantity: string | number;

  @IsNotEmpty()
  unitPrice: string | number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsDateString()
  @IsNotEmpty()
  issueDate: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate: string;

  @IsString()
  @IsOptional()
  projectName?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsOptional()
  discount?: string | number;

  @IsOptional()
  taxRate?: string | number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLineItemDto)
  lineItems: CreateLineItemDto[];
}
