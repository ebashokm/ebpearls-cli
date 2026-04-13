## Description

Site Setting Module

## Installation

The Site Setting Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/site-settings folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';

and SiteSettingsModule from import array
```