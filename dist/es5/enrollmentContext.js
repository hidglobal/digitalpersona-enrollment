import { User } from '@digitalpersona/core';
/**
 * Enrollment context.
 * @remarks
 * Pass the context object into token enrollment APIs. The single context may be shared.
 */
var EnrollmentContext = /** @class */ (function () {
    function EnrollmentContext(
    /** DigitalPersona Enrollment web service client */
    enrollService, 
    /** A JSON Web Token or a username of a user whose credentials are to be enrolled.
     * @remarks
     * Only DigitalPersona users (formerly "Altus User") can be enrolled without authentication,
     * i.e. using only a user name. Other users must be authenticated, i.e. have a JSON Web Token.
     */
    user, 
    /** An optional JSON Web Token of a security officer performing an attended enrollment.
     * If not provided, the API should try to use a user's own token instead for a self-enrollment.
     * In this case the user must be allowed to do self-enrollment.
     */
    securityOfficer) {
        this.enrollService = enrollService;
        this.user = user;
        this.securityOfficer = securityOfficer;
        if (!this.enrollService)
            throw new Error("enrollService");
        if (!this.user)
            throw new Error("user");
        if (!this.securityOfficer && !(this.user instanceof User))
            this.securityOfficer = this.user;
    }
    /**
     * Check is the user has an authentication token, or just a user name.
     * @returns `true` if user identity represented by an authenticatication token, `false` otherwise.
     */
    EnrollmentContext.prototype.isAuthenticated = function () {
        return !(this.user instanceof User);
    };
    /**
     * Returns user identity in a form of authentication token.
     * @remarks
     * The user must be authenticated.
     */
    EnrollmentContext.prototype.getJWT = function () {
        return (this.user instanceof User) ? "" : this.user;
    };
    /**
     * Returns user identity in a form of a username.
     * @remarks
     * The user may be authenticated or not. If authenticated, the username will be produced from
     * the authentication token claims.
     */
    EnrollmentContext.prototype.getUser = function () {
        return (this.user instanceof User) ? this.user : User.fromJWT(this.user);
    };
    return EnrollmentContext;
}());
export { EnrollmentContext };
//# sourceMappingURL=enrollmentContext.js.map