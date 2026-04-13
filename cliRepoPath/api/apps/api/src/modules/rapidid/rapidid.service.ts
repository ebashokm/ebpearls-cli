import { isUserAbove18Year, isValidDob } from '@app/common/helpers/genericFunction';
import { UsersRepository } from '@app/data-access';
import { Injectable } from '@nestjs/common';
import { RapidIdDocumentType } from '@app/common/enum/rapidIdDocumentType.enum';
import { I18nService } from 'nestjs-i18n';
import { RapidIdService } from '@app/rapidid/index';
/**
 * Description placeholder
 *
 * @export
 * @class RapidIdVerificationService
 * @typedef {RapidIdVerificationService}
 */
@Injectable()
export class RapidIdVerificationService {
  /**
   * Creates an instance of RapidIdVerificationService.
   *
   * @constructor
   * @param {RapidIdService} rapidIdService
   * @param {UsersRepository} userRepository
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly rapidIdService: RapidIdService,
    private readonly userRepository: UsersRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {*} body
   * @returns {unknown}
   */
  async verifyMedicare(userId: string, body) {
    let result = { success: true, message: null, data: null };

    try {
      if (!isValidDob(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.invalid_date_of_birth');
        result.success = false;
      }

      const user = await this.userRepository.findOne({ _id: userId });

      if (!user) {
        result.message = this.i18nService.t('rapidId.user_not_found');
        result.success = false;
      }

      result.data = await this.rapidIdService.verifyMedicareDocument(body);

      if (result.data.success) {
        user.rapidIdVerified = true;
        user.rapidIdDocumentType = RapidIdDocumentType.Medicare;
        await user.save();
      }
    } catch (error) {
      result.message = error.message;
      result.success = false;
    }

    return result;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {*} body
   * @returns {unknown}
   */
  async verifyPassport(userId: string, body) {
    let result = { success: true, message: null, data: null };

    try {
      if (!isValidDob(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.invalid_date_of_birth');
        result.success = false;
      }

      if (!isUserAbove18Year(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.date_of_birth_should_be_grater_then_18');
        result.success = false;
      }

      const user = await this.userRepository.findById(userId);

      if (!user) {
        result.message = this.i18nService.t('rapidId.user_not_found');
        result.success = false;
      }

      result.data = await this.rapidIdService.verifyPassportDocument(body);

      if (result.data.success) {
        user.rapidIdVerified = true;
        user.rapidIdDocumentType = RapidIdDocumentType.Passport;
        await user.save();
      }
    } catch (error) {
      result.message = error?.message;
      result.success = false;
    }

    return result;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {*} body
   * @returns {unknown}
   */
  async verifyDriverLicense(userId: string, body) {
    let result = { success: true, message: null, data: null };

    try {
      if (!isValidDob(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.invalid_date_of_birth');
        result.success = false;
        return result;
      }
      if (!isUserAbove18Year(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.date_of_birth_should_be_grater_then_18');
        result.success = false;
        return result;
      }
      const user = await this.userRepository.findById(userId);

      if (!user) {
        result.message = this.i18nService.t('rapidId.user_not_found');
        result.success = false;
        return result;
      }

      result.data = await this.rapidIdService.verifyDrivingLicenseDocument(body);

      if (result.data.success) {
        user.rapidIdVerified = true;
        user.rapidIdDocumentType = RapidIdDocumentType.DriverLicense;
        await user.save();
      }
    } catch (error) {
      result.message = error?.message;
      result.success = false;
    }

    return result;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {*} body
   * @returns {unknown}
   */
  async verifyNzDriverLicence(userId: string, body) {
    let result = { success: true, message: null, data: null };

    try {
      if (!isValidDob(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.invalid_date_of_birth');
        result.success = false;
        return result;
      }
      if (!isUserAbove18Year(body?.BirthDate)) {
        result.message = this.i18nService.t('rapidId.date_of_birth_should_be_grater_then_18');
        result.success = false;
        return result;
      }
      const user = await this.userRepository.findById(userId);

      if (!user) {
        result.message = this.i18nService.t('rapidId.user_not_found');
        result.success = false;
        return result;
      }

      result.data = await this.rapidIdService.NZVerifyDrivingLicenceDocument(body);

      if (result.data.success) {
        user.rapidIdVerified = true;
        user.rapidIdDocumentType = RapidIdDocumentType.DriverLicense;
        await user.save();
      }
    } catch (error) {
      result.message = error?.message;
      result.success = false;
    }

    return result;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {*} body
   * @returns {unknown}
   */
  async verifyNzPassport(userId: string, body) {
    let result = { success: true, message: null, data: null };

    try {
      if (!isValidDob(body?.DateOfBirth)) {
        result.message = this.i18nService.t('rapidId.invalid_date_of_birth');
        result.success = false;
        return result;
      }

      if (!isUserAbove18Year(body?.DateOfBirth)) {
        result.message = this.i18nService.t('rapidId.date_of_birth_should_be_grater_then_18');
        result.success = false;
        return result;
      }

      const user = await this.userRepository.findById(userId);

      if (!user) {
        result.message = this.i18nService.t('rapidId.user_not_found');
        result.success = false;
        return result;
      }

      result.data = await this.rapidIdService.NZVerifyPassportDocument(body);

      if (result.data.success) {
        user.rapidIdVerified = true;
        user.rapidIdDocumentType = RapidIdDocumentType.DriverLicense;
        await user.save();
      }
    } catch (error) {
      result.message = error?.message;
      result.success = false;
    }

    return result;
  }
}
