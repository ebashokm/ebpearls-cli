## Description

Testimonials Module

## Installation

Testimonials Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/cms-api/src/modules/testimonials folder

- Remove folowing code from apps/cms-api/src/app.module.ts
```bash
import { TestimonialsModule } from './modules/testimonials/testimonials.module';

and TestimonialsModule from import array
```