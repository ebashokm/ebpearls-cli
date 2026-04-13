## Description

Email Template Module

## Installation

The Email Template Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/email-template folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { EmailTemplateModule } from './modules/email-template/email-template.module';

and EmailTemplateModule from import array
```