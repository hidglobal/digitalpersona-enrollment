import { BioSample } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Face enrollment API.
 */
export declare class FaceEnroll extends Enroller {
    /** Constructs a new face enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a face enrollment availability.
     * @returns a fulfilled promise when a face can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a face.
     * @param samples - a collection of face images.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(samples: BioSample[]): Promise<void>;
    /** Deletes the face enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
