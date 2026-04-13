## Description

Page With Version Module

## Installation

The Page With Version Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/page-with-version folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { PageWithVersionModule } from './modules/page-with-version/pageWithVersion.module';

and PageWithVersionModule from import array
```