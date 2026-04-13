import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { RapidIdVerificationService } from './rapidid.service';
import { DocsVerificationResponse } from './dtos/response/docs-verifiaction.response';
import { MedicareVerificationInput } from './dtos/input/medicare.input';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { PassportVerificationInput } from './dtos/input/passport.input';
import { DriverLicenceVerificationInput } from './dtos/input/driver-licence.input';
import { NzDriverLicenceVerificationInput } from './dtos/input/nz-driver-licence.input';
import { NzPassportVerificationInput } from './dtos/input/nz-passport.input';
import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '../../guards/auth.user.guard';

/**
 * Description placeholder
 *
 * @export
 * @class RapidIdResolver
 * @typedef {RapidIdResolver}
 */
@Resolver()
export class RapidIdResolver {
  /**
   * Creates an instance of RapidIdResolver.
   *
   * @constructor
   * @param {RapidIdVerificationService} rapidIdVerificationService
   */
  constructor(private readonly rapidIdVerificationService: RapidIdVerificationService) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {MedicareVerificationInput} body
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => DocsVerificationResponse)
  async verifyMedicare(@LoginDetail() loginDetail, @Args('body') body: MedicareVerificationInput) {
    const result = await this.rapidIdVerificationService.verifyMedicare(loginDetail?.userId, body);

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {PassportVerificationInput} body
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => DocsVerificationResponse)
  async verifyPassport(@LoginDetail() loginDetail, @Args('body') body: PassportVerificationInput) {
    const result = await this.rapidIdVerificationService.verifyPassport(loginDetail?.userId, body);
    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {DriverLicenceVerificationInput} body
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => DocsVerificationResponse)
  async verifyDriverLicence(
    @LoginDetail() loginDetail,
    @Args('body') body: DriverLicenceVerificationInput,
  ) {
    const result = await this.rapidIdVerificationService.verifyDriverLicense(
      loginDetail?.userId,
      body,
    );
    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {NzDriverLicenceVerificationInput} body
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => DocsVerificationResponse)
  async verifyNzDriverLicence(
    @LoginDetail() loginDetail,
    @Args('body') body: NzDriverLicenceVerificationInput,
  ) {
    const result = await this.rapidIdVerificationService.verifyNzDriverLicence(
      loginDetail?.userId,
      body,
    );

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {NzPassportVerificationInput} body
   * @returns {unknown}
   */
  @UseGuards(AuthUserGuard)
  @Mutation(() => DocsVerificationResponse)
  async verifyNzPassport(
    @LoginDetail() loginDetail,
    @Args('body')
    body: NzPassportVerificationInput,
  ) {
    const result = await this.rapidIdVerificationService.verifyNzPassport(
      loginDetail?.userId,
      body,
    );

    if (result.success) {
      return result.data;
    } else {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  }
}
