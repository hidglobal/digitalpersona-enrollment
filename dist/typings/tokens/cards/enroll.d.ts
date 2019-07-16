import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Smartcard enrollment data.
 */
export interface SmartCardEnrollmentData {
    /** A version. */
    version: string;
    /** An enrollment timestamp. */
    timeStamp: number;
    /** A key hash of the card. */
    keyHash: string;
    /** A nickname of the card. */
    nickname: string;
}
/**
 * Smartcard enrollment API.
 */
export declare class SmartCardEnroll extends Enroller {
    /** Constructs a new smartcard enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a list of enrolled cards.
     * @returns a promise to return a list of user's enrolled cards.
     */
    getEnrolledCards(): Promise<SmartCardEnrollmentData[]>;
    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(cardData: string): Promise<void>;
    /**
     * Deletes a specific smart card enrollment defined by its pubilc key hash.
     * @param keyHash - a key hash of the card. If not provided, all smartcard enrollments will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(keyHash?: string): Promise<void>;
}
/**
 * Contactless card enrollment API.
 */
export declare class ContactlessCardEnroll extends Enroller {
    /** Constructs a new contactless card enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(cardData: string): Promise<void>;
    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
/**
 * Proximity card enrollment API.
 */
export declare class ProximityCardEnroll extends Enroller {
    /** Constructs a new proximity card enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(cardData: string): Promise<void>;
    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
