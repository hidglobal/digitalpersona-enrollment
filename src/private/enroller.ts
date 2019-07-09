import { User, Credential, Ticket, CredentialId } from '@digitalpersona/core';
import { EnrollmentContext } from '..';

/** @internal */
export abstract class Enroller
{
    constructor(
        protected readonly context: EnrollmentContext,
    ){
        if (!this.context)
            throw new Error("context");
    }

    protected _canEnroll(credId: CredentialId): Promise<void>
    {
        return this.context.enrollService.IsEnrollmentAllowed(
            new Ticket(this.context.securityOfficer || ""),
            this.context.getUser(),
            credId,
        );
    }

    protected _enroll(credential: Credential): Promise<void>
    {
        if (this.context.user instanceof User) {
            return this.context.enrollService.EnrollAltusUserCredentials(
                new Ticket(this.context.securityOfficer || ""),
                this.context.user,
                credential);
        } else {
            return this.context.enrollService.EnrollUserCredentials(
                new Ticket(this.context.securityOfficer || ""),
                new Ticket(this.context.user),
                credential);
        }
    }

    protected _unenroll(credential: Credential): Promise<void>
    {
        if (this.context.user instanceof User) {
            return this.context.enrollService.DeleteAltusUserCredentials(
                new Ticket(this.context.securityOfficer || ""),
                this.context.user,
                credential);
        } else {
            return this.context.enrollService.DeleteUserCredentials(
                new Ticket(this.context.securityOfficer || ""),
                new Ticket(this.context.user),
                credential);
        }
    }

}
