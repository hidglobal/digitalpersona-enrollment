import { __extends } from "tslib";
import { Credential, Ticket } from '@digitalpersona/core';
import { CustomAction } from './actions';
import { Enroller } from '../../private';
/**
 * Password enrollment API.
 * @remarks
 * As a primary credential, user's password cannot be unenroled, it can only be changed, reset or randomized.
 */
var PasswordEnroll = /** @class */ (function (_super) {
    __extends(PasswordEnroll, _super);
    /** Constructs a new password enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    function PasswordEnroll(context) {
        return _super.call(this, context) || this;
    }
    /** Reads a password change availability.
     * @returns a fulfilled promise when a password can be changed, a rejected promise otherwise.
     */
    PasswordEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.Password);
    };
    /**
     * Changes a password.
     * @param newPassword - a new password.
     * @param oldPassword - a password to replace. Must match the existing password.
     * @returns a promise to perform the password change or reject in case of an error.
     */
    PasswordEnroll.prototype.enroll = function (newPassword, oldPassword) {
        return _super.prototype._enroll.call(this, new Credential(Credential.Password, { oldPassword: oldPassword, newPassword: newPassword }));
    };
    /**
     * Resets a password.
     * @param newPassword - a new password which will replace any existing password.
     * @returns a promise to perform the password reset or reject in case of an error.
     * @remarks
     * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
     * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
     */
    PasswordEnroll.prototype.reset = function (newPassword) {
        return _super.prototype._enroll.call(this, new Credential(Credential.Password, newPassword));
    };
    /**
     * Creates a new strong password with good complexity properties.
     * @returns a promise to return a randomized password.
     * @remarks
     * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
     * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
     */
    PasswordEnroll.prototype.randomize = function () {
        return this.context.enrollService.CustomAction(new Ticket(this.context.securityOfficer || ""), this.context.getUser(), new Credential(Credential.Password), CustomAction.PasswordRandomization);
    };
    return PasswordEnroll;
}(Enroller));
export { PasswordEnroll };
//# sourceMappingURL=enroll.js.map