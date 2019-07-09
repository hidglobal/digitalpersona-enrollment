import { Credential, Utf8, BioSample, FingerPosition, Finger, Fingers } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';

/**
 * Fingerprint enrollment API.
 */
export class FingerprintsEnroll extends Enroller
{
    /** Constructs a new fingerprint enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a fingerprint enrollment status.
     * @returns a promise to return fingerprint enrollment data. The data is a collection of enrolled fingers.
     */
    public getEnrolledFingers(): Promise<Fingers>
    {
        return this.context.enrollService
            .GetEnrollmentData(this.context.getUser(), Credential.Fingerprints)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as object[])
                .map(item => Finger.fromJson(item)));
    }

    /** Reads a fingerprint enrollment availability.
     * @returns a fulfilled promise when fingerprints can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void>
    {
        return super._canEnroll(Credential.Fingerprints);
    }

    /** Enrolls a fingerprint.
     * @param position - a position of a finger to enroll
     * @param samples - a collection of fingerprint scans.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(
        position: FingerPosition | Finger,
        samples: BioSample[],
    ): Promise<void>
    {
        const data = {
            position: (position instanceof Finger) ? position.position : position,
            samples,
        };
        return super._enroll(new Credential(Credential.Fingerprints, data));
    }

    /** Deletes the fingerprint enrollment.
     * @param position - a position(s) of a finger(s) to delete.
     *                   If not defined, all enrolled fingerprintss will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(
        position?: FingerPosition | Finger | Array<FingerPosition | Finger>,
    ): Promise<void>
    {
        const data =
            typeof(position) === "number"   ? [{ position}] :
            (position instanceof Finger)    ? [position] :
            (position instanceof Array)     ? position.map(p => (p instanceof Finger) ? p.position : p)
                                            : null;
        return super._unenroll(new Credential(Credential.Fingerprints, data));
    }
}
