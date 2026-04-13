import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [MongooseModule.forRoot(process.env.DB_CONNECTION_STRING)],
  exports: [MongooseModule],
})
export class DatabaseProvider {}
