## Description

Page Module

## Installation

The Page Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/pages folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { PagesModule } from './modules/pages/pages.module';

and PagesModule from import array

and PagesModule from include array of graphql
```