# Role Module

The **Role module** manages roles and their permissions and enables **permission-based access control** across both **CMS API** and **API** projects.

---

## Locations

```
cms-api/src/modules/role
libs/data-access/src/roles/role.schema.ts

cms-api/src/modules/auth/decorator
api/src/modules/auth/decorator

libs/data-access/src/permission
libs/data-access/src/user/user.schema.ts
```

---

## Overview

* Defines **Role** entities with referenced permissions
* Role permissions are stored as **IDs referencing the Permission schema**
* Roles can be assigned to users
* Supports role management via GraphQL resolvers
* Allows **adding and removing permissions from roles**
* Enforces authorization using `@Permissions()` decorator and `PermissionsGuard`
* Shared across **cms-api** and **api**

---

## Role Structure

```
Role {
  permissions: ObjectId[]   // references Permission schema
}
```

```
User {
  roles: ObjectId[]         // references Role schema
}
```
---

## How It Works

### Role Schema

**Location**

```
libs/data-access/src/roles/role.schema.ts
```

Defines the Role model and maintains permission references.

---

### User ↔ Role Relationship

**Location**
```
libs/data-access/src/users/users.schema.ts
```

```
User{
    roles: ObjectId[];
}
```

A user can have multiple roles, and permissions are resolved through these roles.

### Role Resolver

**Location**

```
cms-api/src/modules/role/role.resolver.ts
```

Handles:

* Create role
* Delete role
* Add permission to role
* Remove permission from role

---

### Permissions Decorator

**Locations**

```
cms-api/src/modules/auth/decorator
api/src/modules/auth/decorator
```

```ts
@Permissions(...permissions: string[])
```

Used to declare required permissions on resolvers:

```ts
@Mutation()
@Permissions('create-business')
createBusiness() {}
```

---

### Permissions Guard

**Location**

```
libs/data-access/src/permission
```

* Reads required permissions from decorator metadata
* Resolves user permissions from assigned roles
* Grants denies access

---
## Using the Role Module

To enable role management:

1. Import the module in your app module:

```ts
import { RoleModule } from './modules/role';

@Module({
  imports: [RoleModule],
})
export class AppModule {}
```

2. The module registers the resolver and service automatically.
3. Permissions are enforced automatically via `@Permissions()` and `PermissionsGuard`.

---

## Removing the Role Module

To remove role-based authorization:

1. Delete role module:

   ```
   cms-api/src/modules/role
   ```

2. Remove role schema:

   ```
   libs/data-access/src/roles
   ```

3. Remove permission guard:

   ```
   libs/data-access/src/permission
   ```

4. Remove permissions decorators and its references:

   ```
   cms-api/src/modules/auth/decorator
   api/src/modules/auth/decorator
   ```

---

## Notes

* Roles store **permission references**, not strings
* Authorization is declarative via decorators
* Guards centralize enforcement logic
* Can be fully removed without touching business services
