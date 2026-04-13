## Description

Raipid ID Module

## Installation

The Raipid ID Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/rapidid folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { RapidIdModule } from './modules/rapidid/rapidid.module';

and RapidIdModule from import array

and RapidIdModule from include array of graphql
```