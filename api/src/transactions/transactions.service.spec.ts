import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsService } from './transactions.service';
import { faker } from '@faker-js/faker';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<TransactionEntity>;
  let transactionsList: TransactionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    transactionsList = [];
    for (let i = 0; i < 5; i++) {
      const transaction: TransactionEntity = await repository.save({
        userLogin: faker.internet.userName(),
        endpoint: faker.internet.url(),
        method: 'GET',
        statusCode: 200,
        createdAt: faker.date.between({ from: '2024-01-01', to: '2024-01-31' }),
      });
      transactionsList.push(transaction);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new transaction', async () => {
    const transaction: TransactionEntity = {
      id: '',
      userLogin: faker.internet.userName(),
      endpoint: faker.internet.url(),
      method: 'POST',
      statusCode: 201,
      createdAt: new Date(),
    };

    const newTransaction = await service.create(transaction);
    expect(newTransaction).not.toBeNull();

    const storedTransaction = await repository.findOne({
      where: { id: newTransaction.id },
    });
    expect(storedTransaction).not.toBeNull();
    expect(storedTransaction.endpoint).toEqual(newTransaction.endpoint);
  });

  it('getTransactionsByDateRange should return paginated transactions within date range', async () => {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-31');
    const page = 1;
    const limit = 3;

    const result = await service.getTransactionsByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );

    expect(result).not.toBeNull();
    expect(result.data.length).toBeLessThanOrEqual(limit);
    expect(result.totalItems).toBe(transactionsList.length);
    expect(result.currentPage).toBe(page);
    expect(result.limit).toBe(limit);
  });

  it('getTransactionsByDateRange should return empty array for out of range dates', async () => {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-31');
    const page = 1;
    const limit = 3;

    const result = await service.getTransactionsByDateRange(
      startDate,
      endDate,
      page,
      limit,
    );

    expect(result).not.toBeNull();
    expect(result.data.length).toBe(0);
    expect(result.totalItems).toBe(0);
  });
});
