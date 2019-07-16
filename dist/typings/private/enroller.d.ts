import { Credential, CredentialId } from '@digitalpersona/core';
import { EnrollmentContext } from '..';
/** @internal */
export declare abstract class Enroller {
    protected readonly context: EnrollmentContext;
    constructor(context: EnrollmentContext);
    protected _canEnroll(credId: CredentialId): Promise<void>;
    protected _enroll(credential: Credential): Promise<void>;
    protected _unenroll(credential: Credential): Promise<void>;
}
