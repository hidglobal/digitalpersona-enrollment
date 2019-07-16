import { User, Ticket } from '@digitalpersona/core';
/** @internal */
export class Enroller {
    constructor(context) {
        this.context = context;
        if (!this.context)
            throw new Error("context");
    }
    _canEnroll(credId) {
        return this.context.enrollService.IsEnrollmentAllowed(new Ticket(this.context.securityOfficer || ""), this.context.getUser(), credId);
    }
    _enroll(credential) {
        if (this.context.user instanceof User) {
            return this.context.enrollService.EnrollAltusUserCredentials(new Ticket(this.context.securityOfficer || ""), this.context.user, credential);
        }
        else {
            return this.context.enrollService.EnrollUserCredentials(new Ticket(this.context.securityOfficer || ""), new Ticket(this.context.user), credential);
        }
    }
    _unenroll(credential) {
        if (this.context.user instanceof User) {
            return this.context.enrollService.DeleteAltusUserCredentials(new Ticket(this.context.securityOfficer || ""), this.context.user, credential);
        }
        else {
            return this.context.enrollService.DeleteUserCredentials(new Ticket(this.context.securityOfficer || ""), new Ticket(this.context.user), credential);
        }
    }
}
//# sourceMappingURL=enroller.js.map