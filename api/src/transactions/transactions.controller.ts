import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTransactionsByDateRange(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    if (!startDate || !endDate) {
      return 'Please provide a start and end date';
    }
    return this.transactionsService.getTransactionsByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );
  }
}
