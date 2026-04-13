import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { providers } from './providers';
import { DataAccessModule } from '@app/data-access';

@Module({
  imports: [HttpModule, DataAccessModule],
  providers: providers,
  exports: [AppointmentModule],
})
export class AppointmentModule {}
