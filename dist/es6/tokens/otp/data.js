import { Utf16 } from "@digitalpersona/core";
export const OTPPushCode = "push";
export class OTPEnrollmentData {
    constructor(phoneNumber, // Last 4 digits of registered Phone number
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
    static fromEnrollmentData(data) {
        const obj = JSON.parse(Utf16.fromBase64Url(data));
        return new OTPEnrollmentData(obj.phoneNumber, obj.serialNumber, obj.pn_tenant_id, obj.pn_api_key, obj.nexmo_api_key, obj.nexmo_api_secret);
    }
}
export class SMSEnrollData {
    constructor(key, phoneNumber, otp) {
        this.key = key;
        this.phoneNumber = phoneNumber;
        this.otp = otp;
    }
}
export class OTPUnlockData {
    constructor(
    // Token serial number.
    // If null or omitted, a user who is a token owner must be provided.
    serialNumber, 
    // Token challenge.
    // Can be set to null when the locked device was initialized for static unlock (i.e. no challenge/response).
    challenge) {
        this.serialNumber = serialNumber;
        this.challenge = challenge;
    }
}
export class EMailEnrollmentData {
    constructor(has_mail) {
        this.has_mail = has_mail;
    }
}
//# sourceMappingURL=data.js.map