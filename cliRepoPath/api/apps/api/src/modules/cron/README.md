## Description

Cron Module

## Installation

The Cron Module is included with the initial setup of Ebtheme and provides an example for configuring cron jobs. It's recommended to place all cron-related code within this module. This way, if cron functionality needs to be separated into a different service in the future, it can help reduce duplication issues during server scaling.

#### Steps

- Remove apps/api/src/modules/cron folder


- Remove folowing code from apps/api/src/app.module.ts
```bash
import { CronModule } from './modules/cron/cron.module';

and CronModule from import array
```