import { __extends } from "tslib";
import { Credential } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Face enrollment API.
 */
var FaceEnroll = /** @class */ (function (_super) {
    __extends(FaceEnroll, _super);
    /** Constructs a new face enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    function FaceEnroll(context) {
        return _super.call(this, context) || this;
    }
    /** Reads a face enrollment availability.
     * @returns a fulfilled promise when a face can be enrolled, a rejected promise otherwise.
     */
    FaceEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.Face);
    };
    /** Enrolls a face.
     * @param samples - a collection of face images.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    FaceEnroll.prototype.enroll = function (samples) {
        return _super.prototype._enroll.call(this, new Credential(Credential.Face, samples));
    };
    /** Deletes the face enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    FaceEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.Face));
    };
    return FaceEnroll;
}(Enroller));
export { FaceEnroll };
//# sourceMappingURL=enroll.js.map