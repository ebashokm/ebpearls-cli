## Description

Taxonomy Module

## Installation

The Taxonomy Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/taxonomy folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { TaxonomyModule } from './modules/taxonomy/taxonomy.module';

and TaxonomyModule from import array
```