## Description

Page Module

## Installation

The Page Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/page folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { PageModule } from './modules/page/page.module';

and PageModule from import array
```