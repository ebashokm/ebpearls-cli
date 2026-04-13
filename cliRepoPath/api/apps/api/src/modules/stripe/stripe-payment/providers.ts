// Resolver
import { StripePaymentResolver } from './stripe-payment.resolver';

// Service
import { StripeWebhookService } from './services/stripe-webhook.service';
import { StripeService } from '@app/stripe';
import { StripePaymentService } from './services/stripe-payment.service';

// Repository
import {
  PaymentMethodRepository,
  StripeCustomerRepository,
  UpdatePhoneNumberRepository,
} from '@app/data-access';
import { ConfigService } from '@nestjs/config';
import { StripePaymentRepository } from './repository/stripe-payment.repository';
import { StripePaymentLogRepository } from './repository/stripe-payment-log.repository';
import { PaymentMethodService } from './services/payment-method.service';
import { S3Service } from '@app/common/services/s3';

export const providers = [
  StripePaymentResolver,
  StripePaymentService,
  StripeWebhookService,
  StripeService,
  ConfigService,
  StripeCustomerRepository,
  PaymentMethodRepository,
  StripePaymentRepository,
  StripePaymentLogRepository,
  UpdatePhoneNumberRepository,
  PaymentMethodService,
  S3Service,
];
