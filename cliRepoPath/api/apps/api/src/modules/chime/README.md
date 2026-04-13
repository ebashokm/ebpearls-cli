## Description

Chime Module

## Installation

Chime module come with initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/api/src/modules/chime folder


- Remove folowing code from apps/api/src/app.module.ts
```bash
import { ChimeModule } from './modules/chime/chime.module';

and ChimeModule from import array

and ChimeModule from include array of graphql
```

- Remove libs/common/services/voip/chime folder

### Methods
- initiateChimeMeeting
- endChimeMeeting
- getMeetingInfo