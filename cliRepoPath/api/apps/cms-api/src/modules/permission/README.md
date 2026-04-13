# Permission Module

The **Permission module** manages permissions and permission groups (modules) for the CMS, enabling **fine-grained access control** across the system. Permissions can be added via **GraphQL resolver** or manually in the database.

---

## Locations

```
libs/data-access/src/permission/permission.schema.ts
libs/data-access/src/permission-module/permission-module.schema.ts

cms-api/src/modules/auth/decorator
api/src/modules/auth/decorator

libs/data-access/src/permission/permission.guard.ts
```

---

## Overview

* Defines **Permission** entities and optional **PermissionModule** grouping
* Permissions can be:

  * Added/edited via **resolver**
  * Created manually in the database
* Permissions can optionally belong to a **PermissionModule**
* Permissions can be assigned to roles via the Role Module
* Enforced via `@Permissions()` decorator and `PermissionsGuard`
* Supports fetching all permissions via GraphQL resolver

---

## Data Model

### PermissionModule

* Acts as a **grouping for permissions**
* Create a module first if you want to organize permissions

### Permission

* **Suggested fields**: name, slug, description, permissionModuleId, isDeleted
  * Add these fields when creating the schema to support grouping, descriptions, and soft deletion
* Permissions can optionally reference a **PermissionModule**
* Assign `permissionModuleId` to a permission to group it under a module

### Role ↔ Permission Relationship

* Roles (from Role Module) reference permissions by ID
* Assign permissions to roles to control access centrally
* Users inherit permissions from their assigned roles

---

## How It Works

### Adding Permissions

**Add permission** via resolver

   * Can also be manually added in the database
   * Assign to a module if desired

### Fetching Permissions

* Resolver query returns all permissions, optionally with module grouping

### Permissions Decorator & Guard

* Use `@Permissions()` in resolvers to enforce access
* Guard reads user roles → permissions → grants execution

---

## Using the Permission Module

1. Import in your app module:

```ts
import { PermissionModule } from './modules/permission';

@Module({
  imports: [PermissionModule],
})
export class AppModule {}
```

2. Resolver and guard are registered automatically
3. Permissions can be assigned to roles and enforced via decorators

---

## Removing the Permission Module

1. Delete schemas:

```
libs/data-access/src/permission
libs/data-access/src/permission-module
```

2. Remove decorators and guards:

```
cms-api/src/modules/auth/decorator
api/src/modules/auth/decorator
libs/data-access/src/permission/permission.guard.ts
```

---

## Notes

* Permissions can be grouped under **PermissionModules**
* Can be added via resolver or manually
* Enforced via `@Permissions()` and `PermissionsGuard`
* Roles reference permissions to control access
* Suggested schema fields: name, slug, description, permissionModuleId, isDeleted
* Centralized and declarative permission management

