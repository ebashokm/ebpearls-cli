const ENDPOINTS = Object.freeze({
  MEDICARE: '/dvs/v1/medicare',
  PASSPORT: '/dvs/v1/passport',
  DRIVER_LICENSE: '/dvs/v1/driverLicence',
  NZ_DRIVER_LICENSE: '/infolog/nzta/driverLicenseVerification',
  NZ_PASSPORT: '/infolog/dia/passportValidation',
});

export const COUNTRY = Object.freeze({
  AUSTRALIA: 'AUS',
  NEW_ZEALAND: 'NZ',
});

export const Messages = {
  RESPONSE_NOT_FOUND: 'Response not found',
  DOCUMENT_VERIFICATION_SUCCESS: (documentType: string) =>
    `${documentType} document verification successful.`,
  DOCUMENT_VERIFICATION_FAIL: (documentType: string) =>
    `${documentType} document verification failed.`,
  UNABLE_TO_VERIFY_DOCUMENT: 'Unable to verify provided document details.',
  DOCUMENT_ERROR: (documentType: string) => `${documentType} document error.`,
  SERVER_ERROR: (documentType: string) => `${documentType} server error.`,
};

export const CODE_TYPE = Object.freeze({
  DOCUMENT_ERROR: 'D',
  SERVER_ERROR: 'S',
  DOCUMENT_NOT_VERIFIED: 'N',
  DOCUMENT_VERIFIED: 'Y',
});

export const NZ_PASSPORT_VERIFY_STATUS = 'Consistent';
export const DEFAULT_HTTP_METHOD = 'POST';

export default ENDPOINTS;
