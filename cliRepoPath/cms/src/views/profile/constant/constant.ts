import * as Yup from 'yup';

export const validationSchemaUserProfile = Yup.object().shape({
    firstName: Yup.string()
        .min(3)
        .max(20)
        .required()
        .label('First name'),
    lastName: Yup.string()
        .min(3)
        .max(20)
        .required()
        .label('Last name')
})

export const initialValuesChangePassword = { password: '', passwordConfirm: '', current: '' };

export const validationSchemaChangePassword = Yup.object().shape({
    password: Yup.string()
        .min(8)
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        )
        .required().label('Password'),
    passwordConfirm: Yup.string()
        .required()
        .label('Confirm password')
        .when('password', {
            is: (val: string) => !!(val && val.length > 0),
            then: () => Yup.string().oneOf([Yup.ref('password')], 'Both Password must be match!')
        }),
    current: Yup.string().max(255).required().label('Current password')
});

export const initialValuesOtp = { token: '' }

export const validationSchemaOtp = Yup.object().shape({
    token: Yup.string()
    .min(6)
    .max(6)
    .required()
    .label('Code')
});

export const configurationList = [
    `Install Google Authenticator (IOS - Android) (IOS - Android).`,
    `In the authenticator app, select "+" icon.`,
    `Select "Scan a barcode (or QR code)" and use the phone's camera to scan this barcode`
];

export type TwoFactorAuthProps = {
    otpAuthUrl: string;
    base32: string;
    closeModal: () => void;
};