import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { Summary } from './types';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {
    console.log('TransactionsService initialized');
    console.log('TransactionsService: prisma', !!this.prisma);
  }

  async getSummary(): Promise<Summary> {
    try {
      console.log('TransactionsService: Fetching transactions for summary');
      const transactions = await this.prisma.transaction.findMany();
      console.log('TransactionsService: Transactions', transactions);
      const summary: Summary = transactions.reduce(
        (acc, t) => {
          if (t.amount > 0) {
            acc.totalIncome += t.amount;
          } else {
            acc.totalExpenses += Math.abs(t.amount);
          }
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0, balance: 0 } as Summary,
      );
      summary.balance = summary.totalIncome - summary.totalExpenses;
      console.log('TransactionsService: Summary', summary);
      return summary;
    } catch (error) {
      console.error('TransactionsService: Error in getSummary', error);
      throw new InternalServerErrorException('Failed to fetch summary');
    }
  }

  async findAll({
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  }: {
    category?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    try {
      const where: any = {};
      if (category) where.category = category;
      if (startDate) where.date = { gte: new Date(startDate) };
      if (endDate) where.date = { ...where.date, lte: new Date(endDate) };

      const [transactions, total] = await Promise.all([
        this.prisma.transaction.findMany({
          where,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.transaction.count({ where }),
      ]);

      return { data: transactions, total, page, limit };
    } catch (error) {
      console.error('TransactionsService: Error in findAll', error);
      throw new InternalServerErrorException('Failed to fetch transactions');
    }
  }

  async findOne(id: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }
      return transaction;
    } catch (error) {
      console.error('TransactionsService: Error in findOne', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to fetch transaction');
    }
  }

  async create(data: CreateTransactionDto) {
    try {
      return await this.prisma.transaction.create({ data });
    } catch (error) {
      console.error('TransactionsService: Error in create', error);
      throw new InternalServerErrorException('Failed to create transaction');
    }
  }

  async update(id: string, data: UpdateTransactionDto) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }
      return await this.prisma.transaction.update({ where: { id }, data });
    } catch (error) {
      console.error('TransactionsService: Error in update', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to update transaction');
    }
  }

  async remove(id: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }
      await this.prisma.transaction.delete({ where: { id } });
    } catch (error) {
      console.error('TransactionsService: Error in remove', error);
      throw error instanceof NotFoundException
        ? error
        : new InternalServerErrorException('Failed to delete transaction');
    }
  }
}
