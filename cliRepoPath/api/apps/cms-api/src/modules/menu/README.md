## Description

Menu Module

## Installation

The Menu Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/faq folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { MenuModule } from './modules/menu/menu.module';

and MenuModule from import array
```