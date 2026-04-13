import fetch from 'node-fetch';
import ENDPOINTS, {
  CODE_TYPE,
  COUNTRY,
  DEFAULT_HTTP_METHOD,
  Messages,
  NZ_PASSPORT_VERIFY_STATUS,
} from './constants';
import {
  PassportVerificationInput,
  MedicareVerificationInput,
  DriverLicenceVerificationInput,
  NzDriverLicenceVerificationInput,
  NzPassportVerificationInput,
} from './interfaces';
import { Injectable } from '@nestjs/common';

import { RapidIdDocumentType } from '@app/common/enum/rapidIdDocumentType.enum';

/**
 * @author Utshab Luitel
 * @description This class is used for RapidID verification.
 * @tutorial https://developers.ridx.io/#intro
 *
 * @param {Object} headers - Default HTTP headers.
 * @param {Object} requestBody - Initializes the request body as an empty object.
 * @param {String} baseUrl - The base URL of the API, configured with RAPID_ID_ENVIRONMENT.
 *
 * @returns {Object}
 */

@Injectable()
export class RapidIdService {
  private readonly baseUrl = `https://${process.env.RAPID_ID_ENVIRONMENT}.ridx.io`;
  private readonly headers = {
    'Content-Type': 'application/json',
    token: process.env.RAPID_ID_ACCESS_TOKEN,
  };
  private readonly requestBody: any = {};

  /**
   * @description Verifies a Medicare document for Australia.
   * @param {Object} inputBody - The input body, as defined in MedicareVerificationInput.
   * @returns {Object} - The response object after Medicare verification.
   */

  async verifyMedicareDocument(inputBody: MedicareVerificationInput) {
    return await this.sendRequest(
      ENDPOINTS.MEDICARE,
      inputBody,
      COUNTRY.AUSTRALIA,
      RapidIdDocumentType.Medicare,
    );
  }

  /**
   * @description Verifies a passport document for Australia.
   * @param {Object} inputBody - The input body, as defined in PassportVerificationInput.
   * @returns {Object} - The response object after passport verification.
   */

  async verifyPassportDocument(inputBody: PassportVerificationInput) {
    return await this.sendRequest(
      ENDPOINTS.PASSPORT,
      inputBody,
      COUNTRY.AUSTRALIA,
      RapidIdDocumentType.Passport,
    );
  }

  /**
   * @description Verifies a driving license document for Australia.
   * @param {Object} inputBody - The input body, as defined in DriverLicenceVerificationInput.
   * @returns {Object} - The response object after driving license verification.
   */

  async verifyDrivingLicenseDocument(inputBody: DriverLicenceVerificationInput) {
    return await this.sendRequest(
      ENDPOINTS.DRIVER_LICENSE,
      inputBody,
      COUNTRY.AUSTRALIA,
      RapidIdDocumentType.DriverLicense,
    );
  }

  /**
   * @description Verifies a driving license document for New Zealand.
   * @param {Object} inputBody - The input body, as defined in NzDriverLicenceVerificationInput.
   * @returns {Object} - The response object after New Zealand driving license verification.
   */

  async NZVerifyDrivingLicenceDocument(inputBody: NzDriverLicenceVerificationInput) {
    //set it null API treat empty string is a something so we have to set it null
    if (inputBody?.MiddleName == '') {
      inputBody.MiddleName = null;
    }

    return await this.sendRequest(
      ENDPOINTS.NZ_DRIVER_LICENSE,
      inputBody,
      COUNTRY.NEW_ZEALAND,
      RapidIdDocumentType.DriverLicense,
    );
  }

  /**
   * @description Verifies a passport document for New Zealand.
   * @param {Object} inputBody - The input body, as defined in NzPassportVerificationInput.
   * @returns {Object} - The response object after New Zealand passport verification.
   */

  async NZVerifyPassportDocument(inputBody: NzPassportVerificationInput) {
    return await this.sendRequest(
      ENDPOINTS.NZ_PASSPORT,
      inputBody,
      COUNTRY.NEW_ZEALAND,
      RapidIdDocumentType.Passport,
    );
  }

  /**
   * @description Sends a request to RapidID for document verification.
   *
   * @param {String} endpoint - The API endpoint for the RapidID request.
   * @param {String} documentType - The type of document (e.g., passport, Medicare), as defined in RapidIdDocumentType.
   * @param {String} countryFor - The country for document verification (e.g., AUS or NZ), as defined in COUNTRY.
   * @param {Object} body - The request body.
   *
   * @returns {Object} - The response object from RapidID after the request.
   */

  async sendRequest(endpoint: string, body: any, countryFor: string, documentType: string = null) {
    let result = { success: true, message: null, data: null };
    let responseData = null;

    try {
      this.requestBody.headers = this.headers;

      if (body) {
        this.requestBody.body = JSON.stringify(body);
      }

      this.requestBody.method = DEFAULT_HTTP_METHOD;
      const response: any = await fetch(`${this.baseUrl}${endpoint}`, this.requestBody);

      if (response) {
        responseData = await response.json();

        if (responseData) {
          result = await this.validateResponseByCountry(responseData, documentType, countryFor);
        }
      } else {
        result.message = Messages.RESPONSE_NOT_FOUND;
        result.success = false;
      }
    } catch (error) {
      result.message = error.message;
      result.success = false;
    }

    return result;
  }

  /**
   * @description Validates the response from sendRequest based on the country (defined in COUNTRY).
   * Different countries have various ID verification options, so the response format may vary.
   *
   * @param {Object} responseData - The response from sendRequest.
   * @param {String} documentType - The type of document (e.g., passport, Medicare), as defined in RapidIdDocumentType.
   * @param {String} country - The country for document verification (e.g., AUS or NZ) as defined in COUNTRY.
   *
   * @returns {Object} - The validated response object based on the country and document type.
   */

  async validateResponseByCountry(responseData: any, documentType: string, country: string) {
    if (responseData?.result) {
      return { success: false, message: responseData.result.error, data: null };
    }

    if (COUNTRY.NEW_ZEALAND) {
      return this.handleNewZealandResponse(responseData, documentType);
    } else {
      return this.handleDefaultResponse(responseData, documentType);
    }
  }

  private handleNewZealandResponse(responseData: any, documentType: string) {
    if (
      responseData.data &&
      (responseData.data.LicenseMatch ||
        responseData.data.ResponseText === NZ_PASSPORT_VERIFY_STATUS)
    ) {
      return {
        success: true,
        data: responseData.data,
        message: Messages.DOCUMENT_VERIFICATION_SUCCESS(documentType),
      };
    }

    return {
      success: false,
      data: responseData,
      message: Messages.DOCUMENT_VERIFICATION_FAIL(documentType),
    };
  }

  private async handleDefaultResponse(responseData: any, documentType: string) {
    const validateMessage = await this.formatMessageResponse(documentType, responseData);

    return {
      success: validateMessage.status,
      data: responseData,
      message: validateMessage.message,
    };
  }

  /**
   * @description Formats the response message for Australian ID verification.
   *
   * @param {Object} verificationResultCode - The response from sendRequest when the inputBody is valid, containing the VerificationResultCode from RapidID.
   * @param {String} documentType - The type of document (e.g., passport, Medicare), as defined in RapidIdDocumentType.
   *
   * @returns {Object} - The formatted response object based on the verification result code and document type.
   */

  private async formatMessageResponse(documentType: string, verificationResultCode: any) {
    const code = verificationResultCode?.VerifyDocumentResult?.VerificationResultCode;

    switch (code) {
      case CODE_TYPE.DOCUMENT_ERROR:
        return {
          status: false,
          message: Messages.DOCUMENT_ERROR(documentType),
        };

      case CODE_TYPE.SERVER_ERROR:
        return {
          status: false,
          message: Messages.SERVER_ERROR(documentType),
        };

      case CODE_TYPE.DOCUMENT_NOT_VERIFIED:
        return {
          status: false,
          message: Messages.DOCUMENT_VERIFICATION_FAIL(documentType),
        };

      case CODE_TYPE.DOCUMENT_VERIFIED:
        return {
          status: true,
          message: Messages.DOCUMENT_VERIFICATION_SUCCESS(documentType),
        };

      default:
        return {
          status: false,
          message: Messages.UNABLE_TO_VERIFY_DOCUMENT,
        };
    }
  }
}
