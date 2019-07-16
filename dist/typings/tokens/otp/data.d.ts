import { Base64UrlString } from "@digitalpersona/core";
export declare type OTPCode = string;
export declare const OTPPushCode = "push";
export declare class OTPEnrollmentData {
    readonly phoneNumber: string;
    readonly serialNumber: string;
    readonly pn_tenant_id?: string | null | undefined;
    readonly pn_api_key?: string | null | undefined;
    readonly nexmo_api_key?: "set" | undefined;
    readonly nexmo_api_secret?: "set" | undefined;
    constructor(phoneNumber: string, // Last 4 digits of registered Phone number
    serialNumber: string, // Last 4 digits of HD OTP Serial number
    pn_tenant_id?: string | null | undefined, // Push Notification Tenant Id.
    pn_api_key?: string | null | undefined, // Push Notification API Key.
    nexmo_api_key?: "set" | undefined, // Nexmo API Key ("set" - set by customer; otherwise omitted).
    nexmo_api_secret?: "set" | undefined);
    static fromEnrollmentData(data: Base64UrlString): OTPEnrollmentData;
}
export declare class SMSEnrollData {
    readonly key: string;
    readonly phoneNumber: string;
    readonly otp?: string | null | undefined;
    constructor(key: string, phoneNumber: string, otp?: string | null | undefined);
}
export declare class OTPUnlockData {
    serialNumber?: string | null | undefined;
    challenge?: string | null | undefined;
    constructor(serialNumber?: string | null | undefined, challenge?: string | null | undefined);
}
export declare class EMailEnrollmentData {
    readonly has_mail: boolean;
    constructor(has_mail: boolean);
}
