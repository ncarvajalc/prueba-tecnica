import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TransactionEntity } from '../../transactions/entities/transaction.entity';
import { RevokedTokenEntity } from '../../revoked-tokens/entities/revoked-token.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([UserEntity, TransactionEntity, RevokedTokenEntity]),
];
