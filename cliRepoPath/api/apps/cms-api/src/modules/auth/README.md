## Description

Auth Module

## Installation

The Auth Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/auth folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { AuthModule } from './modules/auth/auth.module';

and AuthModule from import array
```