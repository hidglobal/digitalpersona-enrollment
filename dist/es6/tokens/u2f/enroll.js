import * as u2fApi from 'u2f-api';
import { Credential, Base64Url } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Universal Second Factor (U2F) enrollment API.
 */
export class U2FEnroll extends Enroller {
    /** Constructs a new U2F enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     * @param appId - an AppID of the service.
     */
    constructor(context, appId) {
        super(context);
        if (!appId)
            throw new Error("appId");
        this.appId = appId;
    }
    /** Reads a U2F enrollment availability.
     * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
     */
    canEnroll() {
        return super._canEnroll(Credential.U2F);
    }
    /**
     * Enrolls a U2F token.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll() {
        const version = "U2F_V2";
        const appId = this.appId;
        const timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
        const challenge = Base64Url.fromUtf16(timestamp.toString());
        const registerRequests = [{ version, appId, challenge }];
        return u2fApi
            .register(registerRequests, [], U2FEnroll.TIMEOUT)
            .then((response) => super._enroll(new Credential(Credential.U2F, Object.assign({ version, appId }, response))));
    }
    /** Deletes the U2F enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll() {
        return super._unenroll(new Credential(Credential.U2F));
    }
}
U2FEnroll.TIMEOUT = 20;
U2FEnroll.TIME_WINDOW = 30;
//# sourceMappingURL=enroll.js.map