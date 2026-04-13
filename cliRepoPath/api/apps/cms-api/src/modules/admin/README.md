## Description

Admin Module

## Installation

The Admin Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/cms-api/src/modules/admin folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { AdminModule } from './modules/admin/admin.module';

and AdminModule from import array
```