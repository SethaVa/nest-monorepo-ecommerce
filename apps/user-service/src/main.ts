import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { OrderServiceModule } from 'apps/order-service/src/order-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
