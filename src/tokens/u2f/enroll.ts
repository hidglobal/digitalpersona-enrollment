import * as u2fApi from 'u2f-api';
import { Credential, Base64Url } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';

/**
 * Universal Second Factor (U2F) enrollment API.
 */
export class U2FEnroll extends Enroller
{
    private static TIMEOUT = 20;
    private static TIME_WINDOW = 30;

    private readonly appId: string;

    /** Constructs a new U2F enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     * @param appId - an AppID of the service.
     */
    constructor(
        context: EnrollmentContext,
        appId: string,
    ){
        super(context);
        if (!appId)
            throw new Error("appId");
        this.appId = appId;
    }

    /** Reads a U2F enrollment availability.
     * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void>
    {
        return super._canEnroll(Credential.U2F);
    }

    /**
     * Enrolls a U2F token.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(): Promise<void>
    {
        const version = "U2F_V2";
        const appId = this.appId;
        const timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
        const challenge = Base64Url.fromUtf16(timestamp.toString());

        const registerRequests: u2fApi.RegisterRequest[] = [{ version, appId, challenge }];

        return u2fApi
            .register(registerRequests, [], U2FEnroll.TIMEOUT)
            .then((response: u2fApi.RegisterResponse) =>
                super._enroll(new Credential(Credential.U2F, { version, appId, ...response })));
    }

    /** Deletes the U2F enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void>
    {
        return super._unenroll(new Credential(Credential.U2F));
    }

}
