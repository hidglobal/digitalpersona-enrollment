import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Password enrollment API.
 * @remarks
 * As a primary credential, user's password cannot be unenroled, it can only be changed, reset or randomized.
 */
export declare class PasswordEnroll extends Enroller {
    /** Constructs a new password enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a password change availability.
     * @returns a fulfilled promise when a password can be changed, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /**
     * Changes a password.
     * @param newPassword - a new password.
     * @param oldPassword - a password to replace. Must match the existing password.
     * @returns a promise to perform the password change or reject in case of an error.
     */
    enroll(newPassword: string, oldPassword: string): Promise<void>;
    /**
     * Resets a password.
     * @param newPassword - a new password which will replace any existing password.
     * @returns a promise to perform the password reset or reject in case of an error.
     * @remarks
     * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
     * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
     */
    reset(newPassword: string): Promise<void>;
    /**
     * Creates a new strong password with good complexity properties.
     * @returns a promise to return a randomized password.
     * @remarks
     * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
     * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
     */
    randomize(): Promise<string>;
}
