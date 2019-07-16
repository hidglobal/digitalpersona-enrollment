import { BioSample, FingerPosition, Finger, Fingers } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Fingerprint enrollment API.
 */
export declare class FingerprintsEnroll extends Enroller {
    /** Constructs a new fingerprint enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a fingerprint enrollment status.
     * @returns a promise to return fingerprint enrollment data. The data is a collection of enrolled fingers.
     */
    getEnrolledFingers(): Promise<Fingers>;
    /** Reads a fingerprint enrollment availability.
     * @returns a fulfilled promise when fingerprints can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a fingerprint.
     * @param position - a position of a finger to enroll
     * @param samples - a collection of fingerprint scans.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(position: FingerPosition | Finger, samples: BioSample[]): Promise<void>;
    /** Deletes the fingerprint enrollment.
     * @param position - a position(s) of a finger(s) to delete.
     *                   If not defined, all enrolled fingerprintss will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(position?: FingerPosition | Finger | Array<FingerPosition | Finger>): Promise<void>;
}
