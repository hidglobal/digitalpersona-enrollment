import * as u2fApi from 'u2f-api';
import { User, Credential, JSONWebToken, Base64Url } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

export class U2FEnroll extends Enroller
{
    private static TIMEOUT = 20;
    private static TIME_WINDOW = 30;

    private readonly appId: string;

    constructor(
        appId: string,
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
        if (!appId)
            throw new Error("appId");
        this.appId = appId;
    }

    public canEnroll(
        user: User,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._canEnroll(user, Credential.U2F, securityOfficer);
    }

    public enroll(
        user: JSONWebToken,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        const version = "U2F_V2";
        const appId = this.appId;
        const timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
        const challenge = Base64Url.fromUtf16(timestamp.toString());

        const registerRequests: u2fApi.RegisterRequest[] = [{ version, appId, challenge }];

        return u2fApi
            .register(registerRequests, [], U2FEnroll.TIMEOUT)
            .then((response: u2fApi.RegisterResponse) =>
                super._enroll(user, new Credential(Credential.U2F, { version, appId, ...response }), securityOfficer));
    }

    public unenroll(
        user: JSONWebToken,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._unenroll(user, new Credential(Credential.U2F), securityOfficer);
    }

}
