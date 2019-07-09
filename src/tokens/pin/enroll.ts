import { Credential } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';

/**
 * Personal Identification Number (PIN) enrollment API.
 */
export class PinEnroll extends Enroller
{
    /** Constructs a new PIN enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a PIN enrollment availability.
     * @returns a fulfilled promise when a PIN can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void>
    {
        return super._canEnroll(Credential.PIN);
    }

    /** Enrolls a PIN.
     * @param pin - a Personal Identification Number (PIN).
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(pin: string): Promise<void>
    {
        return super._enroll(new Credential(Credential.PIN, pin));
    }

    /** Deletes the PIN enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void>
    {
        return super._unenroll(new Credential(Credential.PIN));
    }
}
