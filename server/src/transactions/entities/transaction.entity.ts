import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class SummaryEntity {
  @ApiProperty({
    example: 5000,
    description: 'Total income from all transactions',
  })
  totalIncome: number;

  @ApiProperty({
    example: 2000,
    description: 'Total expenses from all transactions',
  })
  totalExpenses: number;

  @ApiProperty({
    example: 3000,
    description: 'Balance (totalIncome - totalExpenses)',
  })
  balance: number;
}
