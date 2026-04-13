## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

# Nestjs Application

We have 2 application in this monorepo setup. One is CMS API another is API.


## Applications

#### 1. [API](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)

API mainly provide endpoint for Frontend and mobile APP.

#### Features

[Agora](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/agora/)

API for agora chat.

[Auth](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/auth/)

Authentication module

[Stripe connect](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/stripe/stripe-connect/)

Stripe Connect Account module

[Chime](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/chime/)

Chime module

[Coin Management](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/coin-management/)

Coin management

[Comet Chat](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/comet-chat/)

Comet Chat

[Contacts Management](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/contacts/)

Contact sync module

[Cron](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/cron/)

Cron example

[Fake Api](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/fake-api/)

Example of fake api

[Faq](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/faq/)

Faq module

[Feeds](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/feeds/)

Feeds module

[Feed Comment](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/feed-comments/)

Feeds comment

[Feed Replies](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/feed-replies/)

Feeds Replies

[Notification](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/notifications/)

Notification

[Pages](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/pages/)

Pages

[Rapid Id](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/rapidid/)

Rapid Id

[Site Setting](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/site-settings/)

Site Setting

[Stripe Payment](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/stripe/stripe-payment/)

Stripe card and bank payment management

[Stripe Subscription](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/stripe/stripe-subscriptions)

Stripe Subscription

[Inapp Subscription](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/subscription/)

Inapp Subscription

[Users](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/api/src/modules/users/)

Users


#### 2. [CMS API](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/)

CMS API mainly provide endpoint for Admin CMS. All admin related API are provided from here.


#### Features

[Admin](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/admin/)

Admin user management

[App User](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/app-user/)

App user management

[Auth](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/auth/)

Admin authunication

[Business](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/business/)

Business management

[Email Template](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/email-template/)

Email template management

[Faq](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/faq/)

Faq management

[Home Page Template](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/home-page-template/)

Home page template management

[Menu](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/menu/)

Menu management

[Page](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/page/)

Page management

[Page With Version](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/page-with-version/)

Page with version management

[Setting](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/settings/)

Setting management

[Subscription Products](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/subscription-products/)

Subscription product management

[Taxonomy](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/taxonomy)

Taxonomy management

[Testimonials](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/testimonials)

Testimonials management

[Audit Log](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/audit-log)

Audit Log

[Roles](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/role/README.md)

Roles

[Permission](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/apps/cms-api/src/modules/permission/README.md)

Permission


## Libraries

This monorepo also includes **shared libraries** used by applications:

[GraphQL Redis Cache](https://bitbucket.org/ebpearls28/ebthemes-api/src/dev/libs/graphql-redis-cache/README.md)

GraphQL Redis Cache


## Running the app - api(default)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the app - cms-api

```bash
# development
$ npm run start cms-api

# watch mode
$ npm run start:dev cms-api

# production mode
$ npm run start:prod cms-api
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Inapp subscription private package installation

add this package to your project dependencies

```bash
"subscription-package-node": "git+https://[bitbucket-username]:[bitbucket-password]@bitbucket.org/ebpearls28/subscription-package-node.git"
```

## Creating a new resource

```bash
$ npx nest g resource [NewModule] [--no-spec]
# --no-spec avoids creating spec files
```

## Creating new files in existing modules

```bash
# resolver eg:
$ npx nest generate resolver some-resolver modules/users/resolvers [--flat] [--no-spec]
# --flat avoids creating a new folder if it exists
# replace **modules/users/resolvers** with the path you want to create resolver at. same for controllers and services

# controller eg:
$ npx nest g co some-controller modules/users/controllers [--flat] [--no-spec]

# service eg:
$ npx nest g service some-service modules/users/services [--flat] [--no-spec]
```

# Common DTO Usage Guide

## Overview

Common DTOs are stored in `libs/common/dto` and reused across monorepo applications (cms-api, web-api, mobile-api) by extending, omitting, or using directly. Module specific dto should be stored in module folder and others can be stored directly in `libs/common/dto/input` or   `libs/common/dto/response`

## File Structure

```
libs/common/dto/
├── event/input/
│   └── create-event.dto.ts          # Common DTOs
└── input/
    └── base-pagination.dto.ts
```

## Usage Patterns

### 1. Direct Usage (No Changes)

```typescript
import { CreateEventInputDto } from '@app/common/dto/event/input';

@Mutation(() => EventResponse)
async createEvent(@Args('input') input: CreateEventInputDto) {
  return this.eventsService.create(input);
}
```

### 2. Extend DTO (Add Fields)

```typescript
import { CreateEventInputDto } from '@app/common/dto/event/input';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CmsCreateEventInputDto extends CreateEventInputDto {
  @Field()
  @IsMongoId()
  businessId: string;  // App-specific field
}
```

### 3. Omit Fields

```typescript
import { OmitType, InputType } from '@nestjs/graphql';
import { CreateEventInputDto } from '@app/common/dto/event/input';

@InputType()
export class BusinessEventInputDto extends OmitType(CreateEventInputDto, [
  'description',
] as const) {}
```

### 4. Make Fields Optional

```typescript
import { PartialType, InputType } from '@nestjs/graphql';
import { CreateEventInputDto } from '@app/common/dto/event/input';

@InputType()
export class UpdateEventInputDto extends PartialType(CreateEventInputDto) {}
```

### 5. Combine Omit + Extend

```typescript
import { OmitType, InputType, Field } from '@nestjs/graphql';
import { CreateEventInputDto } from '@app/common/dto/event/input';

@InputType()
export class SimpleEventInputDto extends OmitType(CreateEventInputDto, [
  'promoCode',
  'startBookingDate',
] as const) {
  @Field({ nullable: true })
  customField?: string;
}
```

## Available @nestjs/graphql Utilities

| Utility | Use Case |
|---------|----------|
| `OmitType` | Remove specific fields |
| `PartialType` | Make all fields optional |
| `PickType` | Keep only specific fields |
| `IntersectionType` | Combine multiple DTOs |

## Naming Convention

```typescript
// ✅ GOOD - App-specific prefix
CmsCreateEventInputDto      // for cms-api
WebApiCreateEventInputDto   // for web-api

// ❌ AVOID - Generic names
CreateEventInputDto
EventInputDto
```

