import { JSONWebToken, User, Credential, Base64Url } from "@digitalpersona/core";
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from "../../private";

export class TimeOtpEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public enrollSoftwareOtp(
        owner: JSONWebToken|User,
        code: string,
        key: string,
        phoneNumber?: string,
        securityOfficer?: JSONWebToken,
    ){
        return super._enroll(owner, new Credential(Credential.OneTimePassword, {
            otp: code,
            key: Base64Url.fromUtf16(key),
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
