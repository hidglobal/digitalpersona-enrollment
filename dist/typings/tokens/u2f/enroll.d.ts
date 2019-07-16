import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Universal Second Factor (U2F) enrollment API.
 */
export declare class U2FEnroll extends Enroller {
    private static TIMEOUT;
    private static TIME_WINDOW;
    private readonly appId;
    /** Constructs a new U2F enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     * @param appId - an AppID of the service.
     */
    constructor(context: EnrollmentContext, appId: string);
    /** Reads a U2F enrollment availability.
     * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /**
     * Enrolls a U2F token.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(): Promise<void>;
    /** Deletes the U2F enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
