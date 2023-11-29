import { Module } from '@nestjs/common';
import { NutriDietLogger } from './NutriDietLogger';

@Module({
  providers: [NutriDietLogger],
  exports: [NutriDietLogger],
})
export class LoggerModule {}
