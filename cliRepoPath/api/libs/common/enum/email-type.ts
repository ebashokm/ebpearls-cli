import { registerEnumType } from '@nestjs/graphql';

export enum EmailTypeEnum {
  VerificationEmail = 'VerificationEmail',
  InvitationToSolicitor = 'InvitationToSolicitor',
  InvitationToAdmin = 'InvitationToAdmin',
  ViewSharedPortfolio = 'ViewSharedPortfolio',
  VerificationCode = 'VerificationCode',
  AdminPasswordUpdate = 'AdminPasswordUpdate',
  SendForgotPasswordOtp = 'SendForgotPasswordOtp',
  AppLoginOtp = 'AppLoginOtp',
}

export const EmailFunctionType = {
  [EmailTypeEnum.InvitationToAdmin]: 'adminInvitation',
  [EmailTypeEnum.InvitationToSolicitor]: 'solicitorInvitation',
  [EmailTypeEnum.VerificationEmail]: 'verificationEmail',
  [EmailTypeEnum.ViewSharedPortfolio]: 'portfolioInvitation',
  [EmailTypeEnum.VerificationCode]: 'verificationCode',
  [EmailTypeEnum.AdminPasswordUpdate]: 'adminPasswordUpdate',
  [EmailTypeEnum.SendForgotPasswordOtp]: 'sendForgotPasswordOtp',
  [EmailTypeEnum.AppLoginOtp]: 'appLoginOtp',
};

export interface EmailHandlerResponse {
  to: string;
  subject: string;
  html: string;
}

export interface EmailArguments {
  [EmailTypeEnum.InvitationToAdmin]: {
    email?: string;
    name?: string;
    link?: string;
    password?: string;
  };

  [EmailTypeEnum.VerificationEmail]: {
    email?: string;
    name?: string;
    code?: string;
    link?: string;
  };

  [EmailTypeEnum.InvitationToSolicitor]: {
    email?: string;
    name?: string;
    link?: string;
  };

  [EmailTypeEnum.ViewSharedPortfolio]: {
    email?: string;
    name?: string;
    benefactorName?: string;
    url?: string;
  };
  [EmailTypeEnum.VerificationCode]: {
    email?: string;
    name?: string;
    code?: string;
  };

  [EmailTypeEnum.AdminPasswordUpdate]: {
    email?: string;
    name?: string;
    link?: string;
    password?: string;
  };

  [EmailTypeEnum.SendForgotPasswordOtp]: {
    name?: string;
    otp?: string;
  };
  [EmailTypeEnum.AppLoginOtp]: {
    name?: string;
    otp?: string;
  };
}

registerEnumType(EmailTypeEnum, { name: 'EmailTypeEnum' });
