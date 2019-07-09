import { Credential, BioSample } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';

/**
 * Face enrollment API.
 */
export class FaceEnroll extends Enroller
{
    /** Constructs a new face enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a face enrollment availability.
     * @returns a fulfilled promise when a face can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void> {
        return super._canEnroll(Credential.Face);
    }

    /** Enrolls a face.
     * @param samples - a collection of face images.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(samples: BioSample[]): Promise<void> {
        return super._enroll(new Credential(Credential.Face, samples));
    }

    /** Deletes the face enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void> {
        return super._unenroll(new Credential(Credential.Face));
    }

}
