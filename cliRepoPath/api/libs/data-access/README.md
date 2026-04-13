# Data Access Library

This library provides data access layer functionality for the EBThemes API, including MongoDB schemas, repositories, and related utilities.

## Structure

The library is organized into logical domains with consistent patterns:

### Base Repository
- `repository/base.repo.ts` - Generic base repository with common CRUD operations and soft delete support

### Core Entities
- `admin/` - Admin user management
- `user/` - User management and authentication
- `contacts/` - Contact management
- `business/` - Business entity management
- `cms-user/` - CMS user management

### Content Management
- `page/` - Page management
- `advance-page/` - Advanced page features
- `pageWithVersion/` - Versioned pages
- `homePage-template/` - Homepage templates
- `menu/` - Menu management
- `faq/` - FAQ management
- `feed/` - Social feed functionality
- `testimonials/` - Testimonial management
- `taxonomy/` - Taxonomy and categorization

### Settings and Configuration
- `settings/` - Application settings
- `site-settings/` - Site-specific settings
- `email-template/` - Email template management
- `disposable-email/` - Disposable email detection

### Payment and Subscription
- `stripe-customer/` - Stripe customer management
- `stripe-subscription/` - Stripe subscription management
- `inapp-subscription/` - In-app subscription management
- `card/` - Payment card management
- `coin/` - Virtual currency management

### Communication and Notifications
- `notification/` - Notification management
- `push-notification-token/` - Push notification tokens
- `comet/` - CometChat integration
- `chime/` - Amazon Chime integration

### Authentication and Security
- `permission/` - Permission management
- `roles/` - Role management
- `login-info/` - Login information tracking
- `otp-request/` - OTP request management
- `device-info/` - Device information tracking

## Directory Structure Pattern

Each domain directory follows a consistent structure:

```
domain/
├── index.ts                    # Exports all public APIs
├── domain.schema.ts            # MongoDB schema
├── domain.repository.ts        # Repository implementation
├── domain.guard.ts             # Guards (if applicable)
├── enum/                       # Enums (if applicable)
│   ├── domain-status.enum.ts
│   └── domain-type.enum.ts
└── domain.module.ts            # NestJS module (if applicable)
```

## Usage

### Importing from the library

```typescript
// Import specific entities
import { User, UserSchema, UsersRepository } from '@libs/data-access';

// Import base repository
import { BaseRepo } from '@libs/data-access';

// Import enums
import { AdminStatus, AdminRoles } from '@libs/data-access';
```

### Using the Base Repository

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepo } from '@libs/data-access';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersRepository extends BaseRepo<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  // Custom methods can be added here
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }
}
```

## Features

### Soft Delete Support
All repositories extend the base repository which includes soft delete functionality:
- `softDelete()` - Marks records as deleted without removing them
- `restoreSoftDeleted()` - Restores soft-deleted records
- `findSoftDeleted()` - Finds only soft-deleted records
- `findWithSoftDeleted()` - Finds all records including soft-deleted ones

### Pagination Support
Built-in pagination methods:
- `findWithPaginate()` - Paginated find operations
- `aggregatePaginate()` - Paginated aggregation operations

### Aggregation Support
- `aggregate()` - Raw aggregation pipeline support
- `totalAggregate()` - Count aggregation results

## Best Practices

1. **Consistent Naming**: Use kebab-case for file names and camelCase for exports
2. **Enum Organization**: Place enums in an `enum/` subdirectory when there are multiple enums
3. **Export Organization**: Group exports by category in index files (enums, schemas, repositories, etc.)
4. **Module Exports**: Export modules separately to avoid naming conflicts
5. **Documentation**: Include JSDoc comments for all public APIs

## Migration Notes

This library has been refactored to improve:
- Consistent naming conventions
- Better organization of exports
- Proper enum management
- Clear separation of concerns
- Enhanced documentation

All existing imports should continue to work, but consider updating to use the new organized structure for better maintainability. 

---

# Transactional Management (Mongoose + CLS)

**References:**
*   [NestJS CLS Mongoose Adapter Docs](https://papooch.github.io/nestjs-cls/plugins/available-plugins/transactional/mongoose-adapter)
*   [Mongoose Native AsyncLocalStorage Docs](https://mongoosejs.com/docs/transactions.html#asynclocalstorage)

---

## 1. Core Concept: Implicit Transactions
We utilize **Implicit Transactions**. This means you do **not** need to manually pass `session` objects to your database queries (e.g., `.save({ session })`).

*   **How it works:** We use `AsyncLocalStorage` (CLS) to store the transaction session. Mongoose detects this active context automatically.
*   **The Benefit:** Great Developer Experience (DX). Your service methods remain clean, handling business logic without being polluted by infrastructure/DB transaction code.

---

## 2. Configuration
The setup requires enabling ALS in Mongoose and registering the CLS Transactional plugin.

**`app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import mongoose from 'mongoose';

@Module({
  imports: [
    // 1. Configure Mongoose to support AsyncLocalStorage
    MongooseModule.forRootAsync({
      useFactory: async () => {
        // Essential: Enables native Mongoose ALS support
        mongoose.set('transactionAsyncLocalStorage', true);
        return { uri: process.env.MONGO_URI };
      },
    }),

    // 2. Configure CLS with the Transactional Plugin
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
            imports: [MongooseModule],
            adapter: new TransactionalAdapterMongoose({
                mongooseConnectionToken: getConnectionToken(),
            }),
        }),
      ]
    }),
  ],
})
export class AppModule {}
```

---

## 3. Usage

Simply add the `@Transactional()` decorator to any service method.

```typescript
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class UserService {
  
  @Transactional()
  async createUserWithWallet(email: string) {
    // 1. Create User
    // Mongoose automatically picks up the session from CLS
    const user = await this.userModel.create({ email });

    // 2. Create Wallet
    // If this fails, Step 1 is rolled back automatically.
    await this.walletModel.create({ userId: user._id, balance: 0 });
    
    return user;
  }
}
```

---

## 4. Behavior & Pitfalls

### Propagation (Nesting Transactions)
When a transactional method calls another transactional method:
*   **`@Transactional()`** (Default): Joins the existing transaction. If the parent fails, everything rolls back.
*   **`@Transactional(Propagation.REQUIRES_NEW)`**: Suspends the current transaction and creates a *separate, independent* transaction.

### ⚠️ Deferred/Async Functions (Important)
Since transactions rely on Context (LocalStorage), breaking the promise chain breaks the transaction.

*   ✅ **`await function()`**: **Safe.** Context is preserved.
*   ✅ **`Promise.all([...])`**: **Safe.** Context is preserved for parallel tasks.
*   ❌ **No `await` (Fire-and-forget)**: **Unsafe.** The transaction may commit before this function finishes, or the function will run outside the transaction scope.

```typescript
@Transactional()
async process() {
  await this.doA(); // ✅ Included in transaction
  
  this.doB(); // ❌ DANGER: Runs "outside" or races against the commit.
}
```

---

## 5. Pros & Cons

| Feature | Description |
| :--- | :--- |
| **Advantage** | **Cleaner Code:** No need to inject `Connection` or pass `session` arguments. |
| **Advantage** | **Refactoring:** You can wrap complex existing logic in a transaction without rewriting internal methods. |
| **Disadvantage** | **"Magic":** Implicit behavior can be harder to debug if context is lost (e.g., inside `setTimeout`). |

---

## 6. Manual Transaction Management

If we need to remove this library, revert to manual Mongoose transactions:

1.  Remove `@Transactional()` decorator.
2.  Inject `@InjectConnection() private connection: Connection`.
3.  Manually manage the session:

```typescript
// Replacement Code
const session = await this.connection.startSession();
session.startTransaction();
try {
  await this.model.create(dto, { session }); // Pass session explicitly
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}
```