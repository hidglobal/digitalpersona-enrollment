import { SoftwareTimeOTP, HardwareTimeOTP, IEnrollService, JSONWebToken } from "@digitalpersona/access-management";
import { Enroller } from "../../private";

export class TimeOtpEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken
    ){
        super(enrollService, securityOfficer)
    }

    public enrollSoftwareOtp(
        user: JSONWebToken,
        code: string,
        key: string,
        phoneNumber?: string,
        securityOfficer?: JSONWebToken
    ){
        return super._enroll(user, new SoftwareTimeOTP(code, key, phoneNumber), securityOfficer);
    }

    public enrollHardwareOtp(
        user: JSONWebToken,
        code: string,
        serialNumber: string,
        counter?: string,
        timer?: string,
        securityOfficer?: JSONWebToken
    ){
        return super._enroll(user, new HardwareTimeOTP(code, serialNumber, counter, timer), securityOfficer);
    }

}
