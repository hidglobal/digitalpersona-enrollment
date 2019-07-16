import { Enroller } from "../../private";
import { EnrollmentContext } from '../..';
/**
 * One-time password enrollment API.
 */
export declare class TimeOtpEnroll extends Enroller {
    /** Constructs a new One-Time Password enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /**
     * Converts a secret key to a Key URI, which will be encode as a QR Code image to scan.
     * @param key - a secret key to convert to a Key URI string.
     * @returns - a promise to return a Key URI string
     * @remarks
     * For Push Notifications fo AD users, make sure the user's token has an `ad_guid` claim.
     * You may need to use `ClaimsService.GetClaims()` method to append this claim to an existing token.
     */
    createKeyUri(key: Uint8Array): Promise<string>;
    /**
     * Sends an verification code using SMS to the user's device.
     * @param key - a secret key to "seed" an OTP generator and start generating verification codes.
     * @param phoneNumber - a phone number to send a current verification code to.
     */
    sendVerificationCode(key: Uint8Array, phoneNumber: string): Promise<void>;
    /**
     * Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.)
     * @param code - a verification code entered by a user.
     * @param key - a secret key used to "seed" an OTP generator.
     * @param phoneNumber - a phone number the verification code was sent to
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enrollSoftwareOtp(code: string, key: Uint8Array, phoneNumber?: string): Promise<void>;
    /**
     * Enrolls a hardware TOTP token.
     * @param code - a verification code entered by a user.
     * @param serialNumber - a serial number of the TOTP token.
     * @param counter - an optional counter displayed on some token models.
     * @param timer - an optional timer displayed on some token models
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enrollHardwareOtp(code: string, serialNumber: string, counter?: string, timer?: string): Promise<void>;
    /** Deletes the OTP enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
