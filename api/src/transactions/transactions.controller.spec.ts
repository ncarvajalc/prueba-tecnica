import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationResultDto } from '../shared/dtos/paginated-result.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { faker } from '@faker-js/faker';

const mockTransactionsService = () => ({
  getTransactionsByDateRange: jest.fn(),
});

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useFactory: mockTransactionsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTransactionsByDateRange', () => {
    it('should return a paginated result for valid input', async () => {
      const transactions: TransactionEntity[] = [
        {
          id: '',
          userLogin: faker.internet.userName(),
          endpoint: faker.internet.url(),
          method: 'GET',
          statusCode: 200,
          createdAt: new Date(),
        },
      ];

      const paginatedResult = new PaginationResultDto(transactions, 1, 1, 10);

      // Mock the service call
      jest
        .spyOn(service, 'getTransactionsByDateRange')
        .mockResolvedValueOnce(paginatedResult);

      const result = await controller.getTransactionsByDateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        1,
        10,
      );

      expect(service.getTransactionsByDateRange).toHaveBeenCalledWith(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
        1,
        10,
      );
      expect(result).toEqual(paginatedResult);
    });

    it('should return an error message if startDate or endDate is missing', async () => {
      const result = await controller.getTransactionsByDateRange(
        null,
        new Date('2024-01-31'),
        1,
        10,
      );
      expect(result).toEqual('Please provide a start and end date');
    });
  });
});
