import { Schema } from 'mongoose';
import { ClsServiceManager } from 'nestjs-cls';

const getCurrentUserId = (): string | null => {
  try {
    const cls = ClsServiceManager.getClsService();
    const userId = cls.get('userId');
    if (userId) {
      return String(userId);
    }
  } catch (e) {
    console.error('Failed to get userId from CLS Audit Fields Plugin', e);
  }
  return null;
};

export const auditFieldsPlugin = (schema: Schema) => {
  schema.add({
    createdBy: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: String,
      default: null,
    },
  });

  schema.pre('save', function (next) {
    const userId = getCurrentUserId();

    if (userId) {
      if (this.isNew) {
        this['createdBy'] = userId;
      }
      this['updatedBy'] = userId;
    }

    next();
  });

  schema.pre(/updateOne|findOneAndUpdate|findByIdAndUpdate/, function (next) {
    const userId = getCurrentUserId();
    if (!userId) {
      return next(); // If system/cron, do not touch these fields
    }
    const update = (this as any).getUpdate();
    if (update && typeof update === 'object') {
      if (!(update as any).$set) {
        (update as any).$set = {};
      }
      (update as any).$set.updatedBy = userId;

      if ((this as any).getOptions().upsert) {
        if (!(update as any).$setOnInsert) {
          (update as any).$setOnInsert = {};
        }
        (update as any).$setOnInsert.createdBy = userId;
      }
    }
    next();
  });
};
