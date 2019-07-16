import { Utf16 } from "@digitalpersona/core";
export var OTPPushCode = "push";
var OTPEnrollmentData = /** @class */ (function () {
    function OTPEnrollmentData(phoneNumber, // Last 4 digits of registered Phone number
    serialNumber, // Last 4 digits of HD OTP Serial number
    pn_tenant_id, // Push Notification Tenant Id.
    pn_api_key, // Push Notification API Key.
    nexmo_api_key, // Nexmo API Key ("set" - set by customer; otherwise omitted).
    nexmo_api_secret) {
        this.phoneNumber = phoneNumber;
        this.serialNumber = serialNumber;
        this.pn_tenant_id = pn_tenant_id;
        this.pn_api_key = pn_api_key;
        this.nexmo_api_key = nexmo_api_key;
        this.nexmo_api_secret = nexmo_api_secret;
    }
    OTPEnrollmentData.fromEnrollmentData = function (data) {
        var obj = JSON.parse(Utf16.fromBase64Url(data));
        return new OTPEnrollmentData(obj.phoneNumber, obj.serialNumber, obj.pn_tenant_id, obj.pn_api_key, obj.nexmo_api_key, obj.nexmo_api_secret);
    };
    return OTPEnrollmentData;
}());
export { OTPEnrollmentData };
var SMSEnrollData = /** @class */ (function () {
    function SMSEnrollData(key, phoneNumber, otp) {
        this.key = key;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
    }
    return SMSEnrollData;
}());
export { SMSEnrollData };
var OTPUnlockData = /** @class */ (function () {
    function OTPUnlockData(
    // Token serial number.
    // If null or omitted, a user who is a token owner must be provided.
    serialNumber, 
    // Token challenge.
    // Can be set to null when the locked device was initialized for static unlock (i.e. no challenge/response).
    challenge) {
        this.serialNumber = serialNumber;
        this.challenge = challenge;
    }
    return OTPUnlockData;
}());
export { OTPUnlockData };
var EMailEnrollmentData = /** @class */ (function () {
    function EMailEnrollmentData(has_mail) {
        this.has_mail = has_mail;
    }
    return EMailEnrollmentData;
}());
export { EMailEnrollmentData };
//# sourceMappingURL=data.js.map