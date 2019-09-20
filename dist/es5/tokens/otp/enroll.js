import { __extends } from "tslib";
import { User, Credential, JWT, Url, Base32, Ticket, Base64Url } from "@digitalpersona/core";
import { Enroller } from "../../private";
import { CustomAction } from "./actions";
/**
 * One-time password enrollment API.
 */
var TimeOtpEnroll = /** @class */ (function (_super) {
    __extends(TimeOtpEnroll, _super);
    /** Constructs a new One-Time Password enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    function TimeOtpEnroll(context) {
        return _super.call(this, context) || this;
    }
    /**
     * Converts a secret key to a Key URI, which will be encode as a QR Code image to scan.
     * @param key - a secret key to convert to a Key URI string.
     * @returns - a promise to return a Key URI string
     * @remarks
     * For Push Notifications fo AD users, make sure the user's token has an `ad_guid` claim.
     * You may need to use `ClaimsService.GetClaims()` method to append this claim to an existing token.
     */
    TimeOtpEnroll.prototype.createKeyUri = function (key) {
        var type = "totp";
        var jwt = this.context.getJWT();
        var claims = JWT.claims(jwt);
        if (!claims)
            return Promise.reject(new Error('NoClaims'));
        var issuer = claims.dom || claims.iss; // will be used as a prefix of a label
        if (!issuer)
            return Promise.reject(new Error('NoIssuer'));
        var uid = claims.uid || claims["ad_guid"]; // required for Push OTP. Also needs TenantID.
        var username = this.context.getUser().name;
        var secret = Base32.fromBytes(key);
        return this.context.enrollService
            .GetEnrollmentData(User.Anonymous(), Credential.OneTimePassword)
            .then(function (data) {
            var otpData = JSON.parse(data);
            if (!otpData)
                return Promise.reject(new Error("NoEnrollmentData"));
            var pushSupported = uid && otpData.pn_tenant_id;
            var uri = new Url("otpauth://" + type, issuer + ":" + username, {
                secret: secret,
                issuer: issuer,
                apikey: otpData.pn_api_key,
                tenantid: pushSupported ? otpData.pn_tenant_id : undefined,
                useruuid: pushSupported ? uid : undefined,
            });
            return uri.href;
        });
    };
    /**
     * Sends an verification code using SMS to the user's device.
     * @param key - a secret key to "seed" an OTP generator and start generating verification codes.
     * @param phoneNumber - a phone number to send a current verification code to.
     */
    TimeOtpEnroll.prototype.sendVerificationCode = function (key, phoneNumber) {
        return this.context.enrollService
            .CustomAction(Ticket.None(), this.context.getUser(), new Credential(Credential.OneTimePassword, {
            key: Base64Url.fromBytes(key),
            phoneNumber: phoneNumber,
        }), CustomAction.SendSMSRequest)
            .then();
    };
    /**
     * Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.)
     * @param code - a verification code entered by a user.
     * @param key - a secret key used to "seed" an OTP generator.
     * @param phoneNumber - a phone number the verification code was sent to
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    TimeOtpEnroll.prototype.enrollSoftwareOtp = function (code, key, phoneNumber) {
        return _super.prototype._enroll.call(this, new Credential(Credential.OneTimePassword, {
            otp: code,
            key: Base64Url.fromBytes(key),
            phoneNumber: phoneNumber,
        }));
    };
    /**
     * Enrolls a hardware TOTP token.
     * @param code - a verification code entered by a user.
     * @param serialNumber - a serial number of the TOTP token.
     * @param counter - an optional counter displayed on some token models.
     * @param timer - an optional timer displayed on some token models
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    TimeOtpEnroll.prototype.enrollHardwareOtp = function (code, serialNumber, counter, timer) {
        return _super.prototype._enroll.call(this, new Credential(Credential.OneTimePassword, {
            otp: code,
            serialNumber: serialNumber,
            counter: counter,
            timer: timer,
        }));
    };
    /** Deletes the OTP enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    TimeOtpEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.OneTimePassword));
    };
    return TimeOtpEnroll;
}(Enroller));
export { TimeOtpEnroll };
//# sourceMappingURL=enroll.js.map