import { User, JSONWebToken, Credential, CredentialId, Utf8 } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

class CardEnroll extends Enroller
{
    protected readonly credId: CredentialId;

    constructor(
        credId: CredentialId,
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
        this.credId = credId;
    }

    public canEnroll(user: User, securityOfficer?: JSONWebToken): Promise<void> {
        return super._canEnroll(user, this.credId, securityOfficer);
    }

    public enroll(owner: JSONWebToken|User, cardData: string, securityOfficer?: JSONWebToken): Promise<void> {
        return super._enroll(owner, new Credential(this.credId, cardData), securityOfficer);
    }

    public unenroll(owner: JSONWebToken|User, securityOfficer?: JSONWebToken): Promise<void> {
        return super._unenroll(owner, new Credential(this.credId), securityOfficer);
    }
}

export interface SmartCardEnrollmentData {
    version: string;
    timeStamp: number;
    keyHash: string;
    nickname: string;
}

export class SmartCardEnroll extends CardEnroll
{
    constructor(enrollService: IEnrollService, securityOfficer?: JSONWebToken) {
        super(Credential.SmartCard, enrollService, securityOfficer);
    }

    public getEnrolledCards(user: User): Promise<SmartCardEnrollmentData[]>
    {
        return this.enrollService
            .GetEnrollmentData(user, Credential.SmartCard)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as SmartCardEnrollmentData[]));
    }

    // Deletes a specific smart card defined by its pubilc key hash.
    public unenroll(
        owner: JSONWebToken|User,
        securityOfficer?: JSONWebToken,
        keyHash?: string,
    )
    : Promise<void>
    {
        return super._unenroll(owner,
            new Credential(Credential.SmartCard, keyHash), securityOfficer);
    }
}

export class ContactlessCardEnroll extends CardEnroll
{
    constructor(enrollService: IEnrollService, securityOfficer?: JSONWebToken) {
        super(Credential.ContactlessCard, enrollService, securityOfficer);
    }
}

export class ProximityCardEnroll extends CardEnroll
{
    constructor(enrollService: IEnrollService, securityOfficer?: JSONWebToken) {
        super(Credential.ProximityCard, enrollService, securityOfficer);
    }
}
