import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(OrderServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
        },
        consumer: {
          groupId: 'order-consumer-group',
        },
      },
    });

  await app.listen(); 
}
bootstrap();
