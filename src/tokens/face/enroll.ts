import { User, JSONWebToken, Credential, BioSample } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

export class FaceEnroll extends Enroller
{
    constructor(enrollService: IEnrollService, securityOfficer?: JSONWebToken) {
        super(enrollService, securityOfficer);
    }

    public canEnroll(user: User, securityOfficer?: JSONWebToken): Promise<void> {
        return super._canEnroll(user, Credential.Face, securityOfficer);
    }

    public enroll(owner: JSONWebToken|User, samples: BioSample[], securityOfficer?: JSONWebToken): Promise<void> {
        return super._enroll(owner, new Credential(Credential.Face, samples), securityOfficer);
    }

    public unenroll(owner: JSONWebToken|User, securityOfficer?: JSONWebToken): Promise<void> {
        return super._unenroll(owner, new Credential(Credential.Face), securityOfficer);
    }

}
