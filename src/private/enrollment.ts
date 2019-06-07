import { User, JSONWebToken, Credential, Ticket, CredentialId, UserNameType } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';

/** @internal */
export abstract class Enroller
{
    constructor(
        protected readonly enrollService: IEnrollService,
        protected readonly securityOfficer?: JSONWebToken,
    ) {
        if (!this.enrollService)
            throw new Error("enrollService");
    }

    protected _canEnroll(user: User, credId: CredentialId, securityOfficer?: JSONWebToken): Promise<void> {
        return this.enrollService.IsEnrollmentAllowed(
            new Ticket(securityOfficer || this.securityOfficer || ""),
            user,
            credId,
        );
    }

    protected _enroll(owner: JSONWebToken|User, credential: Credential, securityOfficer?: JSONWebToken): Promise<void>
    {
        if (owner instanceof User) {
            return this.enrollService.EnrollAltusUserCredentials(
                new Ticket(securityOfficer || this.securityOfficer || ""),
                owner,
                credential);
        } else {
            return this.enrollService.EnrollUserCredentials(
                new Ticket(securityOfficer || this.securityOfficer || owner),
                new Ticket(owner),
                credential);
        }
    }

    protected _unenroll(owner: JSONWebToken|User, credential: Credential, securityOfficer?: JSONWebToken): Promise<void>
    {
        if (owner instanceof User) {
            return this.enrollService.DeleteAltusUserCredentials(
                new Ticket(securityOfficer || this.securityOfficer || ""),
                owner,
                credential);
        } else {
            return this.enrollService.DeleteUserCredentials(
                new Ticket(securityOfficer || this.securityOfficer || owner),
                new Ticket(owner),
                credential);
        }
    }

}
