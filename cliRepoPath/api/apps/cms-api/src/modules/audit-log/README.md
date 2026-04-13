# Audit Log Module

The **Audit Log module** tracks entity changes (create, update, delete) in the CMS and records them in a centralized audit log.
It works by attaching **middleware-style plugins** to schemas and enriching entities with audit metadata.

---

## Locations

```
cms-api/src/modules/audit-log
libs/common/plugins/audit-fields
libs/common/plugins/audit-log
libs/data-access/src/audit-log
```

---

## Overview

* Automatically adds `createdBy` and `updatedBy` fields
* Tracks entity changes via hooks
* Persists audit log records using a shared schema
* Attaches globally to schemas via plugin imports

---

## Directory Structure

### Audit Log Module

```
cms-api/src/modules/audit-log/
  ├── audit-log.hook.ts
  ├── audit-log.plugin.ts
  └── index.ts
```

### Plugins

```
libs/common/plugins/audit-fields/
  ├── audit-fields.hook.ts
  ├── audit-fields.plugin.ts
  └── index.ts

libs/common/plugins/audit-log/
  ├── audit-log.hook.ts
  ├── audit-log.plugin.ts
  └── index.ts
```

### Schema

```
libs/data-access/src/audit-log
```

Contains the audit log schema used to persist change history.

---

## How It Works

### 1. Audit Fields Plugin

**Purpose:**
Automatically adds and maintains audit-related fields on entities.

Fields added:

* `createdBy`
* `updatedBy`

Handled by:

* `libs/common/plugins/audit-fields/audit-fields.plugin.ts`
* `libs/common/plugins/audit-fields/audit-fields.hook.ts`

These fields are populated during create and update operations.

---

### 2. Audit Log Plugin

**Purpose:**
Tracks entity mutations and writes audit records.

Captured data includes:

* Action type (CREATE / UPDATE / DELETE)
* Entity name and entity ID
* Before / after values
* Acting user (`createdBy` / `updatedBy`)

Handled by:

* `libs/common/plugins/audit-log/audit-log.plugin.ts`
* `libs/common/plugins/audit-log/audit-log.hook.ts`

---

### 3. Plugin Attachment (Important)

Audit plugins are attached **globally to schemas** via side-effect imports.

In `app.module.ts`:

```ts
import '@app/common/plugins/audit-log'; // attach audit log to schemas
```

This import:

* Registers audit plugins
* Hooks into schema lifecycle events
* Enables auditing automatically across entities

No service-level changes are required.

---

## Adding the Audit Log

To enable audit logging:

1. Import the module:

```ts
import { AuditLogModule } from './modules/audit-log';

@Module({
  imports: [AuditLogModule],
})
export class AppModule {}
```

2. Attach the audit plugins:

```ts
import '@app/common/plugins/audit-log';
```

3. Ensure the audit log schema exists:

```
libs/data-access/src/audit-log
```

Once added, audit fields and logs work automatically.

---

## Removing the Audit Log

If audit logging is not required:

1. Remove plugin attachment:

```ts
import '@app/common/plugins/audit-log';
```

2. Remove `AuditLogModule` from `AppModule`
3. Remove plugin registrations:

```
libs/common/plugins/audit-fields
libs/common/plugins/audit-log
```

4. Delete `cms-api/src/modules/audit-log`
5. Remove audit log schema:

```
libs/data-access/src/audit-log
```

6. Clean up related migrations / collections (if any)

---

## Notes for Developers

* Plugins act like middleware hooks
* Audit logic is fully decoupled from business logic
* No manual logging inside services
* Must import the plugin once to activate auditing
* Used nest-cls to handle user-context like userId
* Can create separate model list inside each hooks.
