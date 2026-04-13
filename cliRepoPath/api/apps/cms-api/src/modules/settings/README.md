## Description

Setting Module

## Installation

The Setting Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/settings folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { SettingModule } from './modules/settings/settings.module';

and SettingModule from import array
```