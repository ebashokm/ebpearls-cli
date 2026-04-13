# Sentry Integration

This project uses **Sentry** for centralized error tracking and exception monitoring.
Sentry is initialized automatically during application startup and is **not implemented as a Nest module**.

---

## Overview

* Automatic error tracking via Sentry
* Centralized initialization in `lib/sentry`
* Auto-initialized in `api` and `cms-api`
* Global exception capture using `GlobalExceptionFilter`

---

## Directory Structure

```
libs/sentry/
  ├── index.ts
  └── instrument.ts

api/src/
  ├── instrument.ts
  ├── app.module.ts
  └── exception/global-exception.filter.ts

cms-api/src/
  ...
```

---

## Initialization

In `api/src/instrument.ts` (and `cms-api`):

```ts
import { initSentry } from '@/libs/sentry';

initSentry();
```

This file is imported at the top of `app.module.ts` to auto-initialize Sentry on startup.

```ts
import './instrument';
```

---

## Exception Handling

A `GlobalExceptionFilter` captures unhandled exceptions and reports them to Sentry.

Location:

```
api/src/exception/global-exception.filter.ts
```

---

## Environment Variables

```env
SENTRY_DSN=
```

---

## Removing Sentry

1. Remove `./instrument` import from `app.module.ts`
2. Remove `./instrument`
3. Remove `GlobalExceptionFilter`
4. Delete `libs/sentry`
5. Remove `SENTRY_DSN`
6. Uninstall Sentry dependencies
