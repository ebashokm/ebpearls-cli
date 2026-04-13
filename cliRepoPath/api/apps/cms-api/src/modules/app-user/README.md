## Description

App Users Module

## Installation

The App Users Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/cms-api/src/modules/app-user folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { AppUserModule } from './modules/advance-page/advance-page.module';

and AppUserModule from import array
```