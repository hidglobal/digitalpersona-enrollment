import { User, Credential, JWT, Url, Base64, Base32, Ticket, Base64Url } from "@digitalpersona/core";
import { Enroller } from "../../private";
import { OTPEnrollmentData } from "./data";
import { CustomAction } from "./actions";
import { EnrollmentContext } from '../..';

/**
 * One-time password enrollment API.
 */
export class TimeOtpEnroll extends Enroller
{
    /** Constructs a new One-Time Password enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext) {
        super(context);
    }

    /**
     * Converts a secret key to a Key URI, which will be encode as a QR Code image to scan.
     * @param key - a secret key to convert to a Key URI string.
     * @returns - a promise to return a Key URI string
     * @remarks
     * For Push Notifications fo AD users, make sure the user's token has an `ad_guid` claim.
     * You may need to use `ClaimsService.GetClaims()` method to append this claim to an existing token.
     */
    public createKeyUri(key: Uint8Array): Promise<string>
    {
        const type = "totp";
        const jwt = this.context.getJWT();
        const claims = JWT.claims(jwt);
        if (!claims) return Promise.reject(new Error('NoClaims'));
        const issuer = claims.dom || claims.iss;  // will be used as a prefix of a label
        if (!issuer) return Promise.reject(new Error('NoIssuer'));
        const uid = claims.uid || claims["ad_guid"];     // required for Push OTP. Also needs TenantID.
        const username = this.context.getUser().name;
        const secret = Base32.fromBytes(key);
        return this.context.enrollService
            .GetEnrollmentData(User.Anonymous(), Credential.OneTimePassword)
            .then(data => {
                const otpData: OTPEnrollmentData = JSON.parse(data);
                if (!otpData) return Promise.reject(new Error("NoEnrollmentData"));
                const pushSupported = uid && otpData.pn_tenant_id;
                const uri = new Url(`otpauth://${type}`, `${issuer}:${username}`, {
                    secret,
                    issuer,
                    apikey: otpData.pn_api_key,
                    tenantid: pushSupported ? otpData.pn_tenant_id : undefined,
                    useruuid: pushSupported ? uid : undefined,
                });
                return uri.href;
            });
    }

    /**
     * Sends an verification code using SMS to the user's device.
     * @param key - a secret key to "seed" an OTP generator and start generating verification codes.
     * @param phoneNumber - a phone number to send a current verification code to.
     */
    public sendVerificationCode(
        key: Uint8Array,
        phoneNumber: string,
    ): Promise<void>
    {
        return this.context.enrollService
            .CustomAction(Ticket.None(),
                this.context.getUser(),
                new Credential(Credential.OneTimePassword, {
                    key: Base64Url.fromBytes(key),
                    phoneNumber,
                } ),
                CustomAction.SendSMSRequest)
            .then();
    }

    /**
     * Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.)
     * @param code - a verification code entered by a user.
     * @param key - a secret key used to "seed" an OTP generator.
     * @param phoneNumber - a phone number the verification code was sent to
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enrollSoftwareOtp(
        code: string,
        key: Uint8Array,
        phoneNumber?: string,
    ): Promise<void>
    {
        return super._enroll(new Credential(Credential.OneTimePassword, {
            otp: code,
            key: Base64Url.fromBytes(key),
            phoneNumber,
        }));
    }

    /**
     * Enrolls a hardware TOTP token.
     * @param code - a verification code entered by a user.
     * @param serialNumber - a serial number of the TOTP token.
     * @param counter - an optional counter displayed on some token models.
     * @param timer - an optional timer displayed on some token models
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enrollHardwareOtp(
        code: string,
        serialNumber: string,
        counter?: string,
        timer?: string,
    ): Promise<void>
    {
        return super._enroll(new Credential(Credential.OneTimePassword, {
            otp: code,
            serialNumber,
            counter,
            timer,
        }));
    }

    /** Deletes the OTP enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void>
    {
        return super._unenroll(new Credential(Credential.OneTimePassword));
    }
}
