import { User, Credential, Ticket, JSONWebToken } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { CustomAction } from './actions';
import { Enroller } from '../../private';

export class PasswordEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public canEnroll(
        user: User,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._canEnroll(user, Credential.Password, securityOfficer);
    }

    public enroll(
        user: JSONWebToken|User,
        newPassword: string,
        oldPassword: string,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._enroll(user, new Credential(Credential.Password, {oldPassword, newPassword}), securityOfficer);
    }

    public reset(
        user: JSONWebToken,
        newPassword: string,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        // TODO: this operation is not supported for AD users, check and throw
        return super._enroll(user, new Credential(Credential.Password, newPassword), securityOfficer);
    }

    public randomize(
        user: User,
        securityOfficer?: JSONWebToken,
    ): Promise<string>
    {
        return this.enrollService.CustomAction(
            new Ticket(securityOfficer || this.securityOfficer || ""),
            user,
            new Credential(Credential.Password),
            CustomAction.PasswordRandomization);
    }

    // public reset(user: User, newPassword: string, securityOfficer?: JSONWebToken): Promise<string> {
    //     return this.enrollService.CustomAction(
    //         CustomAction.PasswordReset,
    //         new Ticket(securityOfficer || this.securityOfficer || ""),
    //         user,
    //         new Password(newPassword));
    // }
}
