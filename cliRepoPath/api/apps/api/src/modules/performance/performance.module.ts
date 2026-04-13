import { Module, Global } from '@nestjs/common';
import { PerformanceController } from './performance.controller';
import { PerformanceInterceptor } from '@app/common/interceptors/performance.interceptor';

@Global() // Make it globally available
@Module({
  controllers: [PerformanceController],
  providers: [PerformanceInterceptor],
  exports: [PerformanceInterceptor],
})
export class PerformanceModule {}
