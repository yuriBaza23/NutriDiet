import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class NutriDietLogger extends ConsoleLogger {
  setContext(context: string): void {
    super.setContext(`NutriDiet - ${context}`);
  }
}
