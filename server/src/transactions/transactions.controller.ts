import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { TransactionsService } from './transactions.service';
import {
  SummaryEntity,
  TransactionEntity,
} from './entities/transaction.entity';
import { Summary } from './types';

@ApiTags('transactions')
@Controller()
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {
    console.log('TransactionsController initialized');
    console.log(
      'TransactionsController: transactionsService',
      !!this.transactionsService,
    );
  }

  @Get('summary')
  @ApiOkResponse({ type: SummaryEntity })
  getSummary(): Promise<Summary> {
    console.log('Handling GET /v1/summary');
    return this.transactionsService.getSummary();
  }

  @Post('transactions')
  @ApiCreatedResponse({ type: TransactionEntity })
  create(@Body() createTransactionDto: CreateTransactionDto) {
    console.log('Handling POST /v1/transactions');
    return this.transactionsService.create(createTransactionDto);
  }

  @Get('transactions')
  @ApiOkResponse({ type: [TransactionEntity] })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('category') category?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    console.log('Handling GET /v1/transactions');
    return this.transactionsService.findAll({
      category,
      startDate,
      endDate,
      page: +page,
      limit: +limit,
    });
  }

  @Get('transactions/:id')
  @ApiOkResponse({ type: TransactionEntity })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  findOne(@Param('id') id: string) {
    console.log(`Handling GET /v1/transactions/${id}`);
    return this.transactionsService.findOne(id);
  }

  @Patch('transactions/:id')
  @ApiOkResponse({ type: TransactionEntity })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    console.log(`Handling PATCH /v1/transactions/${id}`);
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete('transactions/:id')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  remove(@Param('id') id: string) {
    console.log(`Handling DELETE /v1/transactions/${id}`);
    return this.transactionsService.remove(id);
  }
}
