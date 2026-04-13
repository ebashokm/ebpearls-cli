import { Module, OnModuleInit } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ContactSearchService } from './contact.search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: process.env.ELASTICSEARCH_NODE,
        auth: {
          username: process.env.ELASTICSEARCH_USERNAME,
          password: process.env.ELASTICSEARCH_PASSWORD,
        },
        maxRetries: 10,
        requestTimeout: 60000,
      }),
    }),
  ],
  providers: [ContactSearchService],
  exports: [ElasticsearchModule, ContactSearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly contactSearchService: ContactSearchService) {}
  public async onModuleInit() {
    await this.contactSearchService.createContactsIndex();
  }
}
