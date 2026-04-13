import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/stripe-redirect')
export class StripeRedirectController {
  @Get('/return-url')
  stripeRedirectRedirect(@Res() res: Response) {
    const deepLink = process.env.STRIPE_DEEPLINK_RETURN_URL;
    res.redirect(deepLink);
  }

  @Get('/refresh-url')
  stripeRefreshRedirect(@Res() res: Response) {
    const deepLink = process.env.STRIPE_DEEPLINK_REFRESH_URL;
    res.redirect(deepLink);
  }
}
