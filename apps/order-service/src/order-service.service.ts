import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class OrderServiceService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafka: ClientKafka,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
