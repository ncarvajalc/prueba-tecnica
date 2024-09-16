import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { postgresConfig } from './config/db/postgres.config';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TransactionsModule } from './transactions/transactions.module';
import authConfig from './config/auth/auth.config';
import placesConfig from './config/apis/places.config';
import { TransactionsMiddleware } from './transactions/transactions.middleware';
import { RevokedTokensModule } from './revoked-tokens/revoked-tokens.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig, placesConfig],
    }),
    ScheduleModule.forRoot(),
    postgresConfig(),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    TransactionsModule,
    RevokedTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TransactionsMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply to all routes
  }
}
