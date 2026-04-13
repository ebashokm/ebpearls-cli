import { Menu, MenuSchema } from '@app/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { providers } from './providers';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class MenuModule
 * @typedef {MenuModule}
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }])],
  providers: providers,
})
export class MenuModule {}
