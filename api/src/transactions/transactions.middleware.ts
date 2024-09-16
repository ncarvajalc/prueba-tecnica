import { Injectable, NestMiddleware } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Injectable()
export class TransactionsMiddleware implements NestMiddleware {
  constructor(private transactionService: TransactionsService) {}

  async use(req: any, res: any, next: any) {
    // Auth token
    const bearer = req.headers['authorization'];
    const decodedToken = bearer ? bearer.split('Bearer ')[1] : null;
    const userLogin = decodedToken
      ? JSON.parse(Buffer.from(decodedToken.split('.')[1], 'base64').toString())
          .login
      : null;

    const { method, originalUrl: endpoint } = req;

    res.on('finish', async () => {
      const statusCode = res.statusCode;
      this.transactionService.create({
        userLogin: userLogin,
        endpoint,
        method,
        statusCode,
        createdAt: new Date(),
        id: undefined,
      });
    });

    next();
  }
}
