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
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [authConfig, placesConfig],
    }),
    postgresConfig(),
    UsersModule,
    AuthModule,
    RestaurantsModule,
    TransactionsModule,
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
