import { Inject, Injectable } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from './inapp-module-definition';
import { ConfigOptions } from './config/config-options';
import * as iap from 'in-app-purchase';
import { IAP_VALIDATION_ERROR_MESSAGE, SANDBOX_MODE } from './config/config-constants';

@Injectable()
export class InappSubscriptionService {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private readonly configOptions: ConfigOptions) {}

  async validateIosReceipt(receipt: any) {
    iap.config({
      /* Configurations for Apple */
      appleExcludeOldTransactions: false, // if you want to exclude old transaction, set this to true. Default is false
      applePassword: this.configOptions.iosSecret, // this comes from iTunes Connect (You need this to valiate subscriptions)
      test: this.configOptions.iapMode === SANDBOX_MODE, // process.env.IPA_MODE === 'sandbox' ? true : false, // For Apple and Googl Play to force Sandbox validation only
      verbose: this.configOptions.iapMode === SANDBOX_MODE, // Output debug logs to stdout stream
    });
    return iap
      .setup()
      .then(() => {
        return iap.validate(receipt).then(this.onSuccess).catch(this.onError);
      })
      .catch((error) => {
        return error;
      });
  }
  async validateAndroidReceipt(receipt: any) {
    iap.config({
      /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
      googleServiceAccount: {
        clientEmail: this.configOptions.androidClientEmail,
        privateKey: this.configOptions.androidPrivateKey,
      },
      test: this.configOptions.iapMode === SANDBOX_MODE, // For Apple and Googl Play to force Sandbox validation only
      verbose: this.configOptions.iapMode === SANDBOX_MODE, // Output debug logs to stdout stream
    });

    return iap
      .setup()
      .then(() => {
        // iap.validate(...) automatically detects what type of receipt you are trying to validate
        return iap.validate(receipt).then(this.onSuccess).catch(this.onError);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }

  onSuccess(validatedData: any) {
    // validatedData: the actual content of the validated receipt
    // validatedData also contains the original receipt
    const options = {
      ignoreCanceled: false, // Apple ONLY (for now...): If true, purchaseData will NOT contain cancceled items
      ignoreExpired: false, // If true, purchaseData will NOT contain exipired subscription items
    };
    // validatedData contains sandbox: true/false for Apple and Amazon
    const purchaseData = iap.getPurchaseData(validatedData, options);
    return { purchaseData, validatedData };
  }
  onError(error: any) {
    const parsedError = JSON.parse(error);
    return new Error(
      parsedError?.message?.error?.message || parsedError?.message || IAP_VALIDATION_ERROR_MESSAGE,
    );
  }
}
