import { __extends } from "tslib";
import { Credential } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Personal Identification Number (PIN) enrollment API.
 */
var PinEnroll = /** @class */ (function (_super) {
    __extends(PinEnroll, _super);
    /** Constructs a new PIN enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    function PinEnroll(context) {
        return _super.call(this, context) || this;
    }
    /** Reads a PIN enrollment availability.
     * @returns a fulfilled promise when a PIN can be enrolled, a rejected promise otherwise.
     */
    PinEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.PIN);
    };
    /** Enrolls a PIN.
     * @param pin - a Personal Identification Number (PIN).
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    PinEnroll.prototype.enroll = function (pin) {
        return _super.prototype._enroll.call(this, new Credential(Credential.PIN, pin));
    };
    /** Deletes the PIN enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    PinEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.PIN));
    };
    return PinEnroll;
}(Enroller));
export { PinEnroll };
//# sourceMappingURL=enroll.js.map