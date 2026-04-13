## Description

Notification Module

## Installation

The Notification Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/notifications folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { NotificationsModule } from './modules/notifications/notifications.module';

and NotificationsModule from import array

and NotificationsModule from include array of graphql
```