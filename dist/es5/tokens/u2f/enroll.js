import { __assign, __extends } from "tslib";
import * as u2fApi from 'u2f-api';
import { Credential, Base64Url } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Universal Second Factor (U2F) enrollment API.
 */
var U2FEnroll = /** @class */ (function (_super) {
    __extends(U2FEnroll, _super);
    /** Constructs a new U2F enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     * @param appId - an AppID of the service.
     */
    function U2FEnroll(context, appId) {
        var _this = _super.call(this, context) || this;
        if (!appId)
            throw new Error("appId");
        _this.appId = appId;
        return _this;
    }
    /** Reads a U2F enrollment availability.
     * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
     */
    U2FEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.U2F);
    };
    /**
     * Enrolls a U2F token.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    U2FEnroll.prototype.enroll = function () {
        var _this = this;
        var version = "U2F_V2";
        var appId = this.appId;
        var timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
        var challenge = Base64Url.fromUtf16(timestamp.toString());
        var registerRequests = [{ version: version, appId: appId, challenge: challenge }];
        return u2fApi
            .register(registerRequests, [], U2FEnroll.TIMEOUT)
            .then(function (response) {
            return _super.prototype._enroll.call(_this, new Credential(Credential.U2F, __assign({ version: version, appId: appId }, response)));
        });
    };
    /** Deletes the U2F enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    U2FEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.U2F));
    };
    U2FEnroll.TIMEOUT = 20;
    U2FEnroll.TIME_WINDOW = 30;
    return U2FEnroll;
}(Enroller));
export { U2FEnroll };
//# sourceMappingURL=enroll.js.map