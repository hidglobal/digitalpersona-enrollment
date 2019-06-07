import { User, JSONWebToken, Credential } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

export class PinEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public canEnroll(
        user: User,
        securityOfficer?: JSONWebToken): Promise<void>
    {
        return super._canEnroll(user, Credential.PIN, securityOfficer);
    }

    public enroll(
        user: JSONWebToken,
        pin: string,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._enroll(user, new Credential(Credential.PIN, pin), securityOfficer);
    }

    public unenroll(
        user: JSONWebToken,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._unenroll(user, new Credential(Credential.PIN), securityOfficer);
    }
}
