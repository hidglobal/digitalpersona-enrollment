import { User, JSONWebToken } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
/**
 * Enrollment context.
 * @remarks
 * Pass the context object into token enrollment APIs. The single context may be shared.
 */
export declare class EnrollmentContext {
    /** DigitalPersona Enrollment web service client */
    readonly enrollService: IEnrollService;
    /** A JSON Web Token or a username of a user whose credentials are to be enrolled.
     * @remarks
     * Only DigitalPersona users (formerly "Altus User") can be enrolled without authentication,
     * i.e. using only a user name. Other users must be authenticated, i.e. have a JSON Web Token.
     */
    user: JSONWebToken | User;
    /** An optional JSON Web Token of a security officer performing an attended enrollment.
     * If not provided, the API should try to use a user's own token instead for a self-enrollment.
     * In this case the user must be allowed to do self-enrollment.
     */
    securityOfficer?: JSONWebToken | undefined;
    constructor(
    /** DigitalPersona Enrollment web service client */
    enrollService: IEnrollService, 
    /** A JSON Web Token or a username of a user whose credentials are to be enrolled.
     * @remarks
     * Only DigitalPersona users (formerly "Altus User") can be enrolled without authentication,
     * i.e. using only a user name. Other users must be authenticated, i.e. have a JSON Web Token.
     */
    user: JSONWebToken | User, 
    /** An optional JSON Web Token of a security officer performing an attended enrollment.
     * If not provided, the API should try to use a user's own token instead for a self-enrollment.
     * In this case the user must be allowed to do self-enrollment.
     */
    securityOfficer?: JSONWebToken | undefined);
    /**
     * Check is the user has an authentication token, or just a user name.
     * @returns `true` if user identity represented by an authenticatication token, `false` otherwise.
     */
    isAuthenticated(): boolean;
    /**
     * Returns user identity in a form of authentication token.
     * @remarks
     * The user must be authenticated.
     */
    getJWT(): JSONWebToken;
    /**
     * Returns user identity in a form of a username.
     * @remarks
     * The user may be authenticated or not. If authenticated, the username will be produced from
     * the authentication token claims.
     */
    getUser(): User;
}
