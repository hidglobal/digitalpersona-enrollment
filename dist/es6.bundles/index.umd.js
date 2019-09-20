(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@digitalpersona/core'), require('u2f-api')) :
    typeof define === 'function' && define.amd ? define(['exports', '@digitalpersona/core', 'u2f-api'], factory) :
    (global = global || self, factory((global.dp = global.dp || {}, global.dp.enrollment = global.dp.enrollment || {}), global.dp.core, global.u2fApi));
}(this, function (exports, core, u2fApi) { 'use strict';

    /**
     * Enrollment context.
     * @remarks
     * Pass the context object into token enrollment APIs. The single context may be shared.
     */
    class EnrollmentContext {
        constructor(
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
            if (!this.securityOfficer && !(this.user instanceof core.User))
                this.securityOfficer = this.user;
        }
        /**
         * Check is the user has an authentication token, or just a user name.
         * @returns `true` if user identity represented by an authenticatication token, `false` otherwise.
         */
        isAuthenticated() {
            return !(this.user instanceof core.User);
        }
        /**
         * Returns user identity in a form of authentication token.
         * @remarks
         * The user must be authenticated.
         */
        getJWT() {
            return (this.user instanceof core.User) ? "" : this.user;
        }
        /**
         * Returns user identity in a form of a username.
         * @remarks
         * The user may be authenticated or not. If authenticated, the username will be produced from
         * the authentication token claims.
         */
        getUser() {
            return (this.user instanceof core.User) ? this.user : core.User.fromJWT(this.user);
        }
    }

    /** @internal */
    class Enroller {
        constructor(context) {
            this.context = context;
            if (!this.context)
                throw new Error("context");
        }
        _canEnroll(credId) {
            return this.context.enrollService.IsEnrollmentAllowed(new core.Ticket(this.context.securityOfficer || ""), this.context.getUser(), credId);
        }
        _enroll(credential) {
            if (this.context.user instanceof core.User) {
                return this.context.enrollService.EnrollAltusUserCredentials(new core.Ticket(this.context.securityOfficer || ""), this.context.user, credential);
            }
            else {
                return this.context.enrollService.EnrollUserCredentials(new core.Ticket(this.context.securityOfficer || ""), new core.Ticket(this.context.user), credential);
            }
        }
        _unenroll(credential) {
            if (this.context.user instanceof core.User) {
                return this.context.enrollService.DeleteAltusUserCredentials(new core.Ticket(this.context.securityOfficer || ""), this.context.user, credential);
            }
            else {
                return this.context.enrollService.DeleteUserCredentials(new core.Ticket(this.context.securityOfficer || ""), new core.Ticket(this.context.user), credential);
            }
        }
    }

    /**
     * Smartcard enrollment API.
     */
    class SmartCardEnroll extends Enroller {
        /** Constructs a new smartcard enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a list of enrolled cards.
         * @returns a promise to return a list of user's enrolled cards.
         */
        getEnrolledCards() {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.SmartCard)
                .then(data => JSON.parse(core.Utf8.fromBase64Url(data)));
        }
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.SmartCard);
        }
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(cardData) {
            return super._enroll(new core.Credential(core.Credential.SmartCard, cardData));
        }
        /**
         * Deletes a specific smart card enrollment defined by its pubilc key hash.
         * @param keyHash - a key hash of the card. If not provided, all smartcard enrollments will be deleted.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll(keyHash) {
            return super._unenroll(new core.Credential(core.Credential.SmartCard, keyHash));
        }
    }
    /**
     * Contactless card enrollment API.
     */
    class ContactlessCardEnroll extends Enroller {
        /** Constructs a new contactless card enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.ContactlessCard);
        }
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(cardData) {
            return super._enroll(new core.Credential(core.Credential.ContactlessCard, cardData));
        }
        /** Deletes the card enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.ContactlessCard));
        }
    }
    /**
     * Proximity card enrollment API.
     */
    class ProximityCardEnroll extends Enroller {
        /** Constructs a new proximity card enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.ProximityCard);
        }
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(cardData) {
            return super._enroll(new core.Credential(core.Credential.ProximityCard, cardData));
        }
        /** Deletes the card enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.ProximityCard));
        }
    }

    /**
     * Face enrollment API.
     */
    class FaceEnroll extends Enroller {
        /** Constructs a new face enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a face enrollment availability.
         * @returns a fulfilled promise when a face can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.Face);
        }
        /** Enrolls a face.
         * @param samples - a collection of face images.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(samples) {
            return super._enroll(new core.Credential(core.Credential.Face, samples));
        }
        /** Deletes the face enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.Face));
        }
    }

    /**
     * Fingerprint enrollment API.
     */
    class FingerprintsEnroll extends Enroller {
        /** Constructs a new fingerprint enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a fingerprint enrollment status.
         * @returns a promise to return fingerprint enrollment data. The data is a collection of enrolled fingers.
         */
        getEnrolledFingers() {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.Fingerprints)
                .then(data => JSON.parse(core.Utf8.fromBase64Url(data))
                .map(item => core.Finger.fromJson(item)));
        }
        /** Reads a fingerprint enrollment availability.
         * @returns a fulfilled promise when fingerprints can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.Fingerprints);
        }
        /** Enrolls a fingerprint.
         * @param position - a position of a finger to enroll
         * @param samples - a collection of fingerprint scans.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(position, samples) {
            const data = {
                position: (position instanceof core.Finger) ? position.position : position,
                samples,
            };
            return super._enroll(new core.Credential(core.Credential.Fingerprints, data));
        }
        /** Deletes the fingerprint enrollment.
         * @param position - a position(s) of a finger(s) to delete.
         *                   If not defined, all enrolled fingerprintss will be deleted.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll(position) {
            const data = typeof (position) === "number" ? [{ position }] :
                (position instanceof core.Finger) ? [position] :
                    (position instanceof Array) ? position.map(p => (p instanceof core.Finger) ? p.position : p)
                        : null;
            return super._unenroll(new core.Credential(core.Credential.Fingerprints, data));
        }
    }

    /** @internal */
    var CustomAction;
    (function (CustomAction) {
        CustomAction[CustomAction["SendEmailVerificationRequest"] = 16] = "SendEmailVerificationRequest";
        CustomAction[CustomAction["SendSMSRequest"] = 513] = "SendSMSRequest";
        CustomAction[CustomAction["SendEmailRequest"] = 514] = "SendEmailRequest";
        CustomAction[CustomAction["UnlockActiveIdHardwareToken"] = 515] = "UnlockActiveIdHardwareToken";
    })(CustomAction || (CustomAction = {}));

    /**
     * One-time password enrollment API.
     */
    class TimeOtpEnroll extends Enroller {
        /** Constructs a new One-Time Password enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /**
         * Converts a secret key to a Key URI, which will be encode as a QR Code image to scan.
         * @param key - a secret key to convert to a Key URI string.
         * @returns - a promise to return a Key URI string
         * @remarks
         * For Push Notifications fo AD users, make sure the user's token has an `ad_guid` claim.
         * You may need to use `ClaimsService.GetClaims()` method to append this claim to an existing token.
         */
        createKeyUri(key) {
            const type = "totp";
            const jwt = this.context.getJWT();
            const claims = core.JWT.claims(jwt);
            if (!claims)
                return Promise.reject(new Error('NoClaims'));
            const issuer = claims.dom || claims.iss; // will be used as a prefix of a label
            if (!issuer)
                return Promise.reject(new Error('NoIssuer'));
            const uid = claims.uid || claims["ad_guid"]; // required for Push OTP. Also needs TenantID.
            const username = this.context.getUser().name;
            const secret = core.Base32.fromBytes(key);
            return this.context.enrollService
                .GetEnrollmentData(core.User.Anonymous(), core.Credential.OneTimePassword)
                .then(data => {
                const otpData = JSON.parse(data);
                if (!otpData)
                    return Promise.reject(new Error("NoEnrollmentData"));
                const pushSupported = uid && otpData.pn_tenant_id;
                const uri = new core.Url(`otpauth://${type}`, `${issuer}:${username}`, {
                    secret,
                    issuer,
                    apikey: otpData.pn_api_key,
                    tenantid: pushSupported ? otpData.pn_tenant_id : undefined,
                    useruuid: pushSupported ? uid : undefined,
                });
                return uri.href;
            });
        }
        /**
         * Sends an verification code using SMS to the user's device.
         * @param key - a secret key to "seed" an OTP generator and start generating verification codes.
         * @param phoneNumber - a phone number to send a current verification code to.
         */
        sendVerificationCode(key, phoneNumber) {
            return this.context.enrollService
                .CustomAction(core.Ticket.None(), this.context.getUser(), new core.Credential(core.Credential.OneTimePassword, {
                key: core.Base64Url.fromBytes(key),
                phoneNumber,
            }), CustomAction.SendSMSRequest)
                .then();
        }
        /**
         * Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.)
         * @param code - a verification code entered by a user.
         * @param key - a secret key used to "seed" an OTP generator.
         * @param phoneNumber - a phone number the verification code was sent to
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enrollSoftwareOtp(code, key, phoneNumber) {
            return super._enroll(new core.Credential(core.Credential.OneTimePassword, {
                otp: code,
                key: core.Base64Url.fromBytes(key),
                phoneNumber,
            }));
        }
        /**
         * Enrolls a hardware TOTP token.
         * @param code - a verification code entered by a user.
         * @param serialNumber - a serial number of the TOTP token.
         * @param counter - an optional counter displayed on some token models.
         * @param timer - an optional timer displayed on some token models
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enrollHardwareOtp(code, serialNumber, counter, timer) {
            return super._enroll(new core.Credential(core.Credential.OneTimePassword, {
                otp: code,
                serialNumber,
                counter,
                timer,
            }));
        }
        /** Deletes the OTP enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.OneTimePassword));
        }
    }

    /** @internal */
    var CustomAction$1;
    (function (CustomAction) {
        CustomAction[CustomAction["PasswordRandomization"] = 4] = "PasswordRandomization";
        CustomAction[CustomAction["PasswordReset"] = 13] = "PasswordReset";
    })(CustomAction$1 || (CustomAction$1 = {}));

    /**
     * Password enrollment API.
     * @remarks
     * As a primary credential, user's password cannot be unenroled, it can only be changed, reset or randomized.
     */
    class PasswordEnroll extends Enroller {
        /** Constructs a new password enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a password change availability.
         * @returns a fulfilled promise when a password can be changed, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.Password);
        }
        /**
         * Changes a password.
         * @param newPassword - a new password.
         * @param oldPassword - a password to replace. Must match the existing password.
         * @returns a promise to perform the password change or reject in case of an error.
         */
        enroll(newPassword, oldPassword) {
            return super._enroll(new core.Credential(core.Credential.Password, { oldPassword, newPassword }));
        }
        /**
         * Resets a password.
         * @param newPassword - a new password which will replace any existing password.
         * @returns a promise to perform the password reset or reject in case of an error.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        reset(newPassword) {
            return super._enroll(new core.Credential(core.Credential.Password, newPassword));
        }
        /**
         * Creates a new strong password with good complexity properties.
         * @returns a promise to return a randomized password.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        randomize() {
            return this.context.enrollService.CustomAction(new core.Ticket(this.context.securityOfficer || ""), this.context.getUser(), new core.Credential(core.Credential.Password), CustomAction$1.PasswordRandomization);
        }
    }

    /**
     * Personal Identification Number (PIN) enrollment API.
     */
    class PinEnroll extends Enroller {
        /** Constructs a new PIN enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /** Reads a PIN enrollment availability.
         * @returns a fulfilled promise when a PIN can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.PIN);
        }
        /** Enrolls a PIN.
         * @param pin - a Personal Identification Number (PIN).
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(pin) {
            return super._enroll(new core.Credential(core.Credential.PIN, pin));
        }
        /** Deletes the PIN enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.PIN));
        }
    }

    /**
     * Security Questions enrollment API.
     */
    class SecurityQuestionsEnroll extends Enroller {
        /** Constructs a new Security Questions enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        constructor(context) {
            super(context);
        }
        /**
         * Reads enrolled Security Questions.
         * @returns a promise to return a collection of enrolled Security Questions.
         */
        getEnrolledQuestions() {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.SecurityQuestions)
                .then(data => JSON.parse(core.Utf8.fromBase64Url(data))
                .map(item => core.Question.fromJson(item)));
        }
        /** Reads a Security Questions enrollment availability.
         * @returns a fulfilled promise when Security Questions can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.SecurityQuestions);
        }
        /**
         * Enrolls Security Questions.
         * @param questionsWithAnswers - a colelction of user's answers to Security Questions.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll(questionsWithAnswers) {
            const equal = (a, b) => a.question.number === b.question.number;
            const unique = (val, idx, arr) => arr.findIndex(qa => equal(qa, val)) === idx;
            const data = questionsWithAnswers
                .filter(qa => qa.question.number === qa.answer.number)
                .filter(unique)
                .sort((a, b) => b.question.number - a.question.number); // server requires reverse order
            return super._enroll(new core.Credential(core.Credential.SecurityQuestions, data));
        }
        /** Deletes the Security Question enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.SecurityQuestions));
        }
    }

    /**
     * Universal Second Factor (U2F) enrollment API.
     */
    class U2FEnroll extends Enroller {
        /** Constructs a new U2F enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         * @param appId - an AppID of the service.
         */
        constructor(context, appId) {
            super(context);
            if (!appId)
                throw new Error("appId");
            this.appId = appId;
        }
        /** Reads a U2F enrollment availability.
         * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
         */
        canEnroll() {
            return super._canEnroll(core.Credential.U2F);
        }
        /**
         * Enrolls a U2F token.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        enroll() {
            const version = "U2F_V2";
            const appId = this.appId;
            const timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
            const challenge = core.Base64Url.fromUtf16(timestamp.toString());
            const registerRequests = [{ version, appId, challenge }];
            return u2fApi.register(registerRequests, [], U2FEnroll.TIMEOUT)
                .then((response) => super._enroll(new core.Credential(core.Credential.U2F, Object.assign({ version, appId }, response))));
        }
        /** Deletes the U2F enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        unenroll() {
            return super._unenroll(new core.Credential(core.Credential.U2F));
        }
    }
    U2FEnroll.TIMEOUT = 20;
    U2FEnroll.TIME_WINDOW = 30;

    exports.ContactlessCardEnroll = ContactlessCardEnroll;
    exports.EnrollmentContext = EnrollmentContext;
    exports.FaceEnroll = FaceEnroll;
    exports.FingerprintsEnroll = FingerprintsEnroll;
    exports.PasswordEnroll = PasswordEnroll;
    exports.PinEnroll = PinEnroll;
    exports.ProximityCardEnroll = ProximityCardEnroll;
    exports.SecurityQuestionsEnroll = SecurityQuestionsEnroll;
    exports.SmartCardEnroll = SmartCardEnroll;
    exports.TimeOtpEnroll = TimeOtpEnroll;
    exports.U2FEnroll = U2FEnroll;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
