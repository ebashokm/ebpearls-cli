## Description

Coin Management Module

## Installation

Coin Management module come with initial setup of Ebtheme. If you do not need this module, Follow these steps.

#### Steps

- Remove apps/api/src/modules/coin-management folder

- Remove folowing code from apps/api/src/app.module.ts
```bash
import { CoinManagementModule } from './modules/coin-management/coin-management.module';

and CoinManagementModule from import array

and CoinManagementModule from include array of graphql
```

### Methods
- addCoinPackage
- getAllCoinPackages
- getCoinPackage
- verifyPurchaseCoinPackages