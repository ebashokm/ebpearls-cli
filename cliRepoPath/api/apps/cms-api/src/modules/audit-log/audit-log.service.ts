import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuditLogFilterParamsDTO } from './dto/input/audit-log-filter-param..dto';
import { auditLogSchemas } from '@app/common/plugins/audit-log';
import { AuditLog, AuditLogDocument, AuditLogRepository } from '@app/data-access';
import { FilterQuery } from 'mongoose';
import { Order } from '@app/common/enum/pagination';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuditLogService {
  private logger = new Logger(AuditLogService.name);

  constructor(
    private readonly i18nService: I18nService,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async getAuditLog(id: string): Promise<AuditLogDocument> {
    const auditLog = await this.auditLogRepository.findById(id);
    if (!auditLog) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'AuditLog' } }),
      );
    }
    return auditLog;
  }

  listTables(): string[] {
    return auditLogSchemas.map((model) => model.name);
  }

  async listAuditLog(input: AuditLogFilterParamsDTO) {
    try {
      const { startDate, endDate, changedBy, action, tables } = input;

      const { searchText, orderBy = 'changedAt', order = Order.DESC, limit = 10, skip = 0 } = input;
      const pageMeta = { limit, skip, orderBy, order };

      const filter: FilterQuery<AuditLog> = {};
      if (searchText) {
        const regex = new RegExp(searchText, 'i'); // Case-insensitive regex
        filter.$or = [
          { tableName: { $regex: regex } },
          { recordId: { $regex: regex } },
          { changedBy: { $regex: regex } },
          { oldValues: { $regex: regex } },
          { newValues: { $regex: regex } },
        ];
      }

      if (startDate && endDate) {
        filter.changedAt = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      if (changedBy?.length) {
        filter.changedBy = { $in: changedBy };
      }

      if (tables?.length) {
        filter.tableName = { $in: tables };
      }

      if (action?.length) {
        filter.action = { $in: action };
      }

      return await this.auditLogRepository.findWithPaginate(filter, pageMeta);
    } catch (err) {
      this.logger.error(`Error listing audit logs: ${err.message}`, err.stack);
      throw err;
    }
  }
}
