import {
    User, JSONWebToken, Credential, Utf8,
    BioSample, FingerPosition, Finger, Fingers } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

export class FingerprintsEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public getEnrolledFingers(user: User): Promise<Fingers>
    {
        return this.enrollService
            .GetEnrollmentData(user, Credential.Fingerprints)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as object[])
                .map(item => Finger.fromJson(item)));
    }

    public canEnroll(
        user: User,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._canEnroll(user, Credential.Fingerprints, securityOfficer);
    }

    public enroll(
        owner: JSONWebToken|User,
        position: FingerPosition | Finger,
        samples: BioSample[],
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        const data = {
            position: (position instanceof Finger) ? position.position : position,
            samples,
        };
        return super._enroll(owner, new Credential(Credential.Fingerprints, data), securityOfficer);
    }

    public unenroll(
        owner: JSONWebToken|User,
        position?: FingerPosition | Finger | Array<FingerPosition | Finger>,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        const data =
            typeof(position) === "number"   ? [{ position}] :
            (position instanceof Finger)    ? [position] :
            (position instanceof Array)     ? position.map(p => (p instanceof Finger) ? p.position : p)
                                            : null;
        return super._unenroll(owner, new Credential(Credential.Fingerprints, data), securityOfficer);
    }
}
