## Description

Feeds Module

## Installation

The Feeds Module is included with the initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove /apps/api/src/modules/feeds, /apps/api/src/modules/feed-replies, /apps/api/src/modules/feed-comments  folders

- Remove folowing code from apps/api/src/app.module.ts
```bash

import { FeedsModule } from './modules/feeds/feeds.module';
import { FeedCommentsModule } from './modules/feed-comments/feed-comments.module';
import { FeedRepliesModule } from './modules/feed-replies/feed-replies.module';

and FeedsModule, FeedCommentsModule, FeedRepliesModule  from import array

and FeedsModule, FeedCommentsModule, FeedRepliesModule from include array of graphql
```