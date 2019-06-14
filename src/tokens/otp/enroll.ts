import { JSONWebToken, User, Credential, JWT, Url, Base64, Base32 } from "@digitalpersona/core";
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from "../../private";
import { OTPEnrollmentData } from "./data";

export class TimeOtpEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    // NOTE: for Push Notifications fo AD users, make sure the `identity` token has an `ad_guid` claim.
    // You may need to use `ClaimsService.GetClaims()` method to add the claim to an existing token.
    public createKeyUri(
        identity: JSONWebToken,
        key: Uint8Array,
    ): Promise<string>
    {
        const type = "totp";
        const jwt = identity || "";
        const claims = JWT.claims(jwt);
        if (!claims) return Promise.reject(new Error('NoClaims'));
        const issuer = claims.dom || claims.iss;  // will be used as a prefix of a label
        if (!issuer) return Promise.reject(new Error('NoIssuer'));
        const uid = claims.uid || claims["ad_guid"];     // required for Push OTP. Also needs TenantID.
        const username = User.fromJWT(identity).name;
        const secret = Base32.fromBytes(key);
        return this.enrollService
            .GetEnrollmentData(User.Anonymous(), Credential.OneTimePassword)
            .then(data => {
                const otpData: OTPEnrollmentData = JSON.parse(data);
                const uri = new Url(`otpauth://${type}`, `${issuer}:${username}`, {
                    secret,
                    issuer,
                    apikey: otpData.pn_api_key,
                    // NOTE: useruuid and tenantid must appear together
                    tenantid: uid ? otpData.pn_tenant_id : undefined,
                    useruuid: otpData.pn_tenant_id ? uid : undefined,
                });
                return uri.href;
            });
    }

    public enrollSoftwareOtp(
        owner: JSONWebToken|User,
        code: string,
        key: Uint8Array,
        phoneNumber?: string,
        securityOfficer?: JSONWebToken,
    ){
        return super._enroll(owner, new Credential(Credential.OneTimePassword, {
            otp: code,
            key: Base64.fromBytes(key),
            phoneNumber,
        }), securityOfficer);
    }

    public enrollHardwareOtp(
        owner: JSONWebToken|User,
        code: string,
        serialNumber: string,
        counter?: string,
        timer?: string,
        securityOfficer?: JSONWebToken,
    ){
        return super._enroll(owner, new Credential(Credential.OneTimePassword, {
            otp: code,
            serialNumber,
            counter,
            timer,
        }), securityOfficer);
    }

    public unenroll(
        owner: JSONWebToken|User,
        securityOfficer?: JSONWebToken,
    ){
        return super._unenroll(owner, new Credential(Credential.OneTimePassword), securityOfficer);
    }
}
