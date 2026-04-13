## Description

FAQ Module

## Installation

The FAQ Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/faq folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { FaqModule } from './modules/faq/faq.module';

and FaqModule from import array
```