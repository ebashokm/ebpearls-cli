import { configValidationSchema } from '@api/config/config.schema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/api/.env',
      validationSchema: configValidationSchema,
    }),
  ],
})
export class ConfigProvider {}
