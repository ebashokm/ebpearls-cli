import { Document, Query, Schema } from 'mongoose';
import { AuditLog, AuditLogActionEnum } from '@app/data-access/audit-log';
import { ClsServiceManager } from 'nestjs-cls';

interface QueryWithOp<
  ResultType = any,
  DocType = any,
  THelpers = Record<string, any>,
  RawDocType = DocType,
  QueryOp = any,
> extends Query<ResultType, DocType, THelpers, RawDocType, QueryOp> {
  op: string;
}

const getCurrentUserId = (fallback: any): string => {
  try {
    const cls = ClsServiceManager.getClsService();
    const clsUserId = cls.get('userId');
    if (clsUserId) return clsUserId;
  } catch (e) {
    console.error('Failed to get userId from CLS', e);
  }
  return fallback || 'system';
};

export const auditLogPlugin = (schema: Schema) => {
  schema.post('init', function (doc: any) {
    doc.$locals._original = doc.toObject({ depopulate: true, virtuals: false });
  });

  schema.pre('save', function (next) {
    const doc = this;
    this.$locals.wasNew = doc.isNew;
    doc.$locals.modifiedPaths = doc
      .modifiedPaths()
      .filter((path) => !['__v', 'updatedAt', 'createdAt', '_id'].includes(path));

    next?.();
  });

  schema.post('save', async function (doc: Document, next) {
    try {
      const AuditLogModel = doc.model(AuditLog.name);
      const modelName = (doc.constructor as any).modelName;
      const userId = getCurrentUserId(doc.$locals.userId);
      const recordId = doc._id.toString();

      const session = doc.$session();

      let logData: any = null;

      if (doc.$locals.wasNew) {
        logData = {
          tableName: modelName,
          recordId: recordId,
          action: AuditLogActionEnum.ADD,
          changedBy: userId,
          newValues: JSON.stringify(doc.toObject()),
        };
      } else {
        const original = doc.$locals._original || {};
        const current = doc.toObject({ depopulate: true, virtuals: false });
        const modifiedPaths = (doc.$locals.modifiedPaths as []) || [];
        const oldValues: Record<string, any> = {};
        const newValues: Record<string, any> = {};
        let hasChanges = false;

        for (const path of modifiedPaths) {
          if (path === '__v' || path === 'updatedAt' || path === 'createdAt') continue;
          if (JSON.stringify(original[path]) !== JSON.stringify(current[path])) {
            oldValues[path] = original[path];
            newValues[path] = current[path];
            hasChanges = true;
          }
        }

        if (hasChanges) {
          oldValues['_id'] = recordId;
          newValues['_id'] = recordId;

          logData = {
            tableName: modelName,
            recordId: recordId,
            action: AuditLogActionEnum.UPDATE,
            changedBy: userId,
            oldValues: JSON.stringify(oldValues),
            newValues: JSON.stringify(newValues),
          };
        }
      }

      if (logData) {
        await new AuditLogModel(logData).save({ session });
      }

      doc.$locals._original = doc.toObject({ depopulate: true, virtuals: false });
      doc.$locals.wasNew = false;
    } catch (err) {
      console.error('[AuditLog] Error logging save:', err);
    }
    next?.();
  });

  schema.pre(
    /updateOne|findOneAndUpdate|findByIdAndUpdate/,
    async function (this: QueryWithOp, next) {
      try {
        const query = this.getQuery();
        const options = this.getOptions();
        const session = options.session;

        (this as any)._originalDoc = await this.model.findOne(query).session(session).lean();
      } catch (err) {
        console.error('[AuditLog] Error in pre-update hook:', err);
      }
      next?.();
    },
  );

  schema.post(
    /updateOne|findOneAndUpdate|findByIdAndUpdate/,
    async function (this: QueryWithOp, doc, next) {
      try {
        const original = (this as any)._originalDoc;

        if (!original) return next?.();

        const options = this.getOptions();
        const session = options.session;
        const userId = getCurrentUserId(options.userId);
        const model = this.model;
        const AuditLogModel = model.db.model(AuditLog.name);

        const current = await model.findById(original._id).session(session).lean();

        if (!current) return next?.();

        const oldValues: Record<string, any> = {};
        const newValues: Record<string, any> = {};
        let hasChanges = false;

        const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);

        for (const key of allKeys) {
          if (['__v', 'updatedAt', 'createdAt', '_id'].includes(key)) continue;

          const val1 = JSON.stringify(original[key]);
          const val2 = JSON.stringify(current[key]);

          if (val1 !== val2) {
            oldValues[key] = original[key];
            newValues[key] = current[key];
            hasChanges = true;
          }
        }

        if (hasChanges) {
          oldValues['_id'] = original['_id'];
          newValues['_id'] = current['_id'];

          const logData = {
            tableName: model.modelName,
            recordId: original._id.toString(),
            action: AuditLogActionEnum.UPDATE,
            changedBy: userId,
            oldValues: JSON.stringify(oldValues),
            newValues: JSON.stringify(newValues),
          };

          await new AuditLogModel(logData).save({ session });
        }
      } catch (err) {
        console.error('[AuditLog] Error in post-update hook:', err);
      }
      next?.();
    },
  );

  const handleDelete = async function (next) {
    try {
      const options = this.getOptions();
      const session = options.session;

      const doc = await this.model.findOne(this.getQuery()).session(session);
      if (!doc) return next?.();

      const AuditLogModel = doc.model(AuditLog.name);
      const modelName = (doc.constructor as any).modelName;
      const userId = getCurrentUserId(options.userId);

      const logData = {
        tableName: modelName,
        recordId: doc._id.toString(),
        action: AuditLogActionEnum.DELETE,
        changedBy: userId,
        oldValues: JSON.stringify(doc.toObject()),
      };

      await new AuditLogModel(logData).save({ session });
    } catch (err) {
      console.error('[AuditLog] Error logging delete:', err);
    }
    next?.();
  };

  schema.pre('findOneAndDelete', handleDelete);
  schema.pre(/deleteOne|remove/, handleDelete);
};
