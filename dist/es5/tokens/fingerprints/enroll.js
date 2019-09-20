import { __extends } from "tslib";
import { Credential, Utf8, Finger } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Fingerprint enrollment API.
 */
var FingerprintsEnroll = /** @class */ (function (_super) {
    __extends(FingerprintsEnroll, _super);
    /** Constructs a new fingerprint enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    function FingerprintsEnroll(context) {
        return _super.call(this, context) || this;
    }
    /** Reads a fingerprint enrollment status.
     * @returns a promise to return fingerprint enrollment data. The data is a collection of enrolled fingers.
     */
    FingerprintsEnroll.prototype.getEnrolledFingers = function () {
        return this.context.enrollService
            .GetEnrollmentData(this.context.getUser(), Credential.Fingerprints)
            .then(function (data) {
            return JSON.parse(Utf8.fromBase64Url(data))
                .map(function (item) { return Finger.fromJson(item); });
        });
    };
    /** Reads a fingerprint enrollment availability.
     * @returns a fulfilled promise when fingerprints can be enrolled, a rejected promise otherwise.
     */
    FingerprintsEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.Fingerprints);
    };
    /** Enrolls a fingerprint.
     * @param position - a position of a finger to enroll
     * @param samples - a collection of fingerprint scans.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    FingerprintsEnroll.prototype.enroll = function (position, samples) {
        var data = {
            position: (position instanceof Finger) ? position.position : position,
            samples: samples,
        };
        return _super.prototype._enroll.call(this, new Credential(Credential.Fingerprints, data));
    };
    /** Deletes the fingerprint enrollment.
     * @param position - a position(s) of a finger(s) to delete.
     *                   If not defined, all enrolled fingerprintss will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    FingerprintsEnroll.prototype.unenroll = function (position) {
        var data = typeof (position) === "number" ? [{ position: position }] :
            (position instanceof Finger) ? [position] :
                (position instanceof Array) ? position.map(function (p) { return (p instanceof Finger) ? p.position : p; })
                    : null;
        return _super.prototype._unenroll.call(this, new Credential(Credential.Fingerprints, data));
    };
    return FingerprintsEnroll;
}(Enroller));
export { FingerprintsEnroll };
//# sourceMappingURL=enroll.js.map