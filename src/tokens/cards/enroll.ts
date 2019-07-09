import { Credential, Utf8 } from '@digitalpersona/core';
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
export class SmartCardEnroll extends Enroller
{
    /** Constructs a new smartcard enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a list of enrolled cards.
     * @returns a promise to return a list of user's enrolled cards.
     */
    public getEnrolledCards(): Promise<SmartCardEnrollmentData[]>
    {
        return this.context.enrollService
            .GetEnrollmentData(this.context.getUser(), Credential.SmartCard)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as SmartCardEnrollmentData[]));
    }

    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void>
    {
        return super._canEnroll(Credential.SmartCard);
    }

    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(cardData: string): Promise<void>
    {
        return super._enroll(new Credential(Credential.SmartCard, cardData));
    }

    /**
     * Deletes a specific smart card enrollment defined by its pubilc key hash.
     * @param keyHash - a key hash of the card. If not provided, all smartcard enrollments will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(keyHash?: string): Promise<void>
    {
        return super._unenroll(new Credential(Credential.SmartCard, keyHash));
    }
}

/**
 * Contactless card enrollment API.
 */
export class ContactlessCardEnroll extends Enroller
{
    /** Constructs a new contactless card enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void>
    {
        return super._canEnroll(Credential.ContactlessCard);
    }

    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(cardData: string): Promise<void>
    {
        return super._enroll(new Credential(Credential.ContactlessCard, cardData));
    }

    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void>
    {
        return super._unenroll(new Credential(Credential.ContactlessCard));
    }
}

/**
 * Proximity card enrollment API.
 */
export class ProximityCardEnroll extends Enroller
{
    /** Constructs a new proximity card enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext){
        super(context);
    }

    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    public canEnroll(): Promise<void> {
        return super._canEnroll(Credential.ProximityCard);
    }

    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    public enroll(cardData: string): Promise<void>
    {
        return super._enroll(new Credential(Credential.ProximityCard, cardData));
    }

    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    public unenroll(): Promise<void>
    {
        return super._unenroll(new Credential(Credential.ProximityCard));
    }
}
