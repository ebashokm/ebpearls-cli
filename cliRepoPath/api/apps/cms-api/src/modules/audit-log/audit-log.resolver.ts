import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuditLogService } from './audit-log.service';
import { AuditLogResponse, PaginatedAuditLogResponse } from './dto/response/audit-log.response';
import { AuditLogFilterParamsDTO } from './dto/input/audit-log-filter-param..dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.authguard';

@UseGuards(JwtAuthGuard)
@Resolver()
export class AuditLogResolver {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Query(() => AuditLogResponse)
  async getAuditLog(@Args('id') id: string) {
    return this.auditLogService.getAuditLog(id);
  }

  @Query(() => [String])
  async listTables() {
    return this.auditLogService.listTables();
  }

  @Query(() => PaginatedAuditLogResponse)
  async listAuditLog(@Args('input') input: AuditLogFilterParamsDTO) {
    return this.auditLogService.listAuditLog(input);
  }
}
