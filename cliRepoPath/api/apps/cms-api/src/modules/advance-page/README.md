## Description

Advance Page Module

## Installation

The Advance Page Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/cms-api/src/modules/advance-page folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { AdvancePageModule } from './modules/advance-page/advance-page.module';

and AdvancePageModule from import array
```