import { JSONWebToken } from '@digitalpersona/core';
import { IAuthService, IEnrollService } from '@digitalpersona/services';

/*
@category Enrollment
*/
export abstract class Enroller
{
    constructor(
        protected readonly authService: IAuthService,
        protected readonly enrollService: IEnrollService,
        protected readonly securityOfficer?: JSONWebToken,
    ){}

}
