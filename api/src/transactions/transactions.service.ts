import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResultDto } from '../shared/dtos/paginated-result.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(transaction: TransactionEntity): Promise<TransactionEntity> {
    return await this.transactionRepository.save(transaction);
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date,
    page: number,
    limit: number,
  ): Promise<PaginationResultDto<TransactionEntity>> {
    const [data, totalItems] = await this.transactionRepository.findAndCount({
      where: {
        createdAt: Between(startDate, endDate),
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return new PaginationResultDto<TransactionEntity>(
      data,
      totalItems,
      page,
      limit,
    );
  }
}
