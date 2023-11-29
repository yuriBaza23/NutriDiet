import { Module } from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { NutriDietLogger } from './common/NutriDietLogger';

@Module({
  imports: [],
  controllers: [],
  providers: [NutriDietLogger, SocketGateway],
})
export class AppModule {}
