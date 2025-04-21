import { IsString, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsDateString()
  date: string;
}

export class UpdateTransactionDto {
  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  amount?: number;

  @ApiProperty({ required: false })
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  date?: string;
}
