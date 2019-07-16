import { User, Ticket } from '@digitalpersona/core';
/** @internal */
var Enroller = /** @class */ (function () {
    function Enroller(context) {
        this.context = context;
        if (!this.context)
            throw new Error("context");
    }
    Enroller.prototype._canEnroll = function (credId) {
        return this.context.enrollService.IsEnrollmentAllowed(new Ticket(this.context.securityOfficer || ""), this.context.getUser(), credId);
    };
    Enroller.prototype._enroll = function (credential) {
        if (this.context.user instanceof User) {
            return this.context.enrollService.EnrollAltusUserCredentials(new Ticket(this.context.securityOfficer || ""), this.context.user, credential);
        }
        else {
            return this.context.enrollService.EnrollUserCredentials(new Ticket(this.context.securityOfficer || ""), new Ticket(this.context.user), credential);
        }
    };
    Enroller.prototype._unenroll = function (credential) {
        if (this.context.user instanceof User) {
            return this.context.enrollService.DeleteAltusUserCredentials(new Ticket(this.context.securityOfficer || ""), this.context.user, credential);
        }
        else {
            return this.context.enrollService.DeleteUserCredentials(new Ticket(this.context.securityOfficer || ""), new Ticket(this.context.user), credential);
        }
    };
    return Enroller;
}());
export { Enroller };
//# sourceMappingURL=enroller.js.map