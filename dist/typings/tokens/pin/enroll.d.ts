import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Personal Identification Number (PIN) enrollment API.
 */
export declare class PinEnroll extends Enroller {
    /** Constructs a new PIN enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a PIN enrollment availability.
     * @returns a fulfilled promise when a PIN can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a PIN.
     * @param pin - a Personal Identification Number (PIN).
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(pin: string): Promise<void>;
    /** Deletes the PIN enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
