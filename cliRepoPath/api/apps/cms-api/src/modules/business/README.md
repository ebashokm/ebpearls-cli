## Description

Business Module

## Installation

The Business Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/business folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { BusinessModule } from './modules/business/business.module';

and BusinessModule from import array
```