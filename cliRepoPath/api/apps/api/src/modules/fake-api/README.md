## Description

Fake API Module

## Installation

The Fake API Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/api/src/modules/fake-api folder


- Remove folowing code from apps/api/src/app.module.ts
```bash
import { FakeApiModule } from './modules/fake-api/fake-api.module';

and FakeApiModule from import array
```