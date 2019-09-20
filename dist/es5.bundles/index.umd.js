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
            if (!this.securityOfficer && !(this.user instanceof core.User))
                this.securityOfficer = this.user;
        }
        /**
         * Check is the user has an authentication token, or just a user name.
         * @returns `true` if user identity represented by an authenticatication token, `false` otherwise.
         */
        EnrollmentContext.prototype.isAuthenticated = function () {
            return !(this.user instanceof core.User);
        };
        /**
         * Returns user identity in a form of authentication token.
         * @remarks
         * The user must be authenticated.
         */
        EnrollmentContext.prototype.getJWT = function () {
            return (this.user instanceof core.User) ? "" : this.user;
        };
        /**
         * Returns user identity in a form of a username.
         * @remarks
         * The user may be authenticated or not. If authenticated, the username will be produced from
         * the authentication token claims.
         */
        EnrollmentContext.prototype.getUser = function () {
            return (this.user instanceof core.User) ? this.user : core.User.fromJWT(this.user);
        };
        return EnrollmentContext;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /** @internal */
    var Enroller = /** @class */ (function () {
        function Enroller(context) {
            this.context = context;
            if (!this.context)
                throw new Error("context");
        }
        Enroller.prototype._canEnroll = function (credId) {
            return this.context.enrollService.IsEnrollmentAllowed(new core.Ticket(this.context.securityOfficer || ""), this.context.getUser(), credId);
        };
        Enroller.prototype._enroll = function (credential) {
            if (this.context.user instanceof core.User) {
                return this.context.enrollService.EnrollAltusUserCredentials(new core.Ticket(this.context.securityOfficer || ""), this.context.user, credential);
            }
            else {
                return this.context.enrollService.EnrollUserCredentials(new core.Ticket(this.context.securityOfficer || ""), new core.Ticket(this.context.user), credential);
            }
        };
        Enroller.prototype._unenroll = function (credential) {
            if (this.context.user instanceof core.User) {
                return this.context.enrollService.DeleteAltusUserCredentials(new core.Ticket(this.context.securityOfficer || ""), this.context.user, credential);
            }
            else {
                return this.context.enrollService.DeleteUserCredentials(new core.Ticket(this.context.securityOfficer || ""), new core.Ticket(this.context.user), credential);
            }
        };
        return Enroller;
    }());

    /**
     * Smartcard enrollment API.
     */
    var SmartCardEnroll = /** @class */ (function (_super) {
        __extends(SmartCardEnroll, _super);
        /** Constructs a new smartcard enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function SmartCardEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a list of enrolled cards.
         * @returns a promise to return a list of user's enrolled cards.
         */
        SmartCardEnroll.prototype.getEnrolledCards = function () {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.SmartCard)
                .then(function (data) {
                return JSON.parse(core.Utf8.fromBase64Url(data));
            });
        };
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        SmartCardEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.SmartCard);
        };
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        SmartCardEnroll.prototype.enroll = function (cardData) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.SmartCard, cardData));
        };
        /**
         * Deletes a specific smart card enrollment defined by its pubilc key hash.
         * @param keyHash - a key hash of the card. If not provided, all smartcard enrollments will be deleted.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        SmartCardEnroll.prototype.unenroll = function (keyHash) {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.SmartCard, keyHash));
        };
        return SmartCardEnroll;
    }(Enroller));
    /**
     * Contactless card enrollment API.
     */
    var ContactlessCardEnroll = /** @class */ (function (_super) {
        __extends(ContactlessCardEnroll, _super);
        /** Constructs a new contactless card enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function ContactlessCardEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        ContactlessCardEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.ContactlessCard);
        };
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        ContactlessCardEnroll.prototype.enroll = function (cardData) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.ContactlessCard, cardData));
        };
        /** Deletes the card enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        ContactlessCardEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.ContactlessCard));
        };
        return ContactlessCardEnroll;
    }(Enroller));
    /**
     * Proximity card enrollment API.
     */
    var ProximityCardEnroll = /** @class */ (function (_super) {
        __extends(ProximityCardEnroll, _super);
        /** Constructs a new proximity card enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function ProximityCardEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a card enrollment availability.
         * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
         */
        ProximityCardEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.ProximityCard);
        };
        /** Enrolls a card.
         * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        ProximityCardEnroll.prototype.enroll = function (cardData) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.ProximityCard, cardData));
        };
        /** Deletes the card enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        ProximityCardEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.ProximityCard));
        };
        return ProximityCardEnroll;
    }(Enroller));

    /**
     * Face enrollment API.
     */
    var FaceEnroll = /** @class */ (function (_super) {
        __extends(FaceEnroll, _super);
        /** Constructs a new face enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function FaceEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a face enrollment availability.
         * @returns a fulfilled promise when a face can be enrolled, a rejected promise otherwise.
         */
        FaceEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.Face);
        };
        /** Enrolls a face.
         * @param samples - a collection of face images.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        FaceEnroll.prototype.enroll = function (samples) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.Face, samples));
        };
        /** Deletes the face enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        FaceEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.Face));
        };
        return FaceEnroll;
    }(Enroller));

    /**
     * Fingerprint enrollment API.
     */
    var FingerprintsEnroll = /** @class */ (function (_super) {
        __extends(FingerprintsEnroll, _super);
        /** Constructs a new fingerprint enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function FingerprintsEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a fingerprint enrollment status.
         * @returns a promise to return fingerprint enrollment data. The data is a collection of enrolled fingers.
         */
        FingerprintsEnroll.prototype.getEnrolledFingers = function () {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.Fingerprints)
                .then(function (data) {
                return JSON.parse(core.Utf8.fromBase64Url(data))
                    .map(function (item) { return core.Finger.fromJson(item); });
            });
        };
        /** Reads a fingerprint enrollment availability.
         * @returns a fulfilled promise when fingerprints can be enrolled, a rejected promise otherwise.
         */
        FingerprintsEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.Fingerprints);
        };
        /** Enrolls a fingerprint.
         * @param position - a position of a finger to enroll
         * @param samples - a collection of fingerprint scans.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        FingerprintsEnroll.prototype.enroll = function (position, samples) {
            var data = {
                position: (position instanceof core.Finger) ? position.position : position,
                samples: samples,
            };
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.Fingerprints, data));
        };
        /** Deletes the fingerprint enrollment.
         * @param position - a position(s) of a finger(s) to delete.
         *                   If not defined, all enrolled fingerprintss will be deleted.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        FingerprintsEnroll.prototype.unenroll = function (position) {
            var data = typeof (position) === "number" ? [{ position: position }] :
                (position instanceof core.Finger) ? [position] :
                    (position instanceof Array) ? position.map(function (p) { return (p instanceof core.Finger) ? p.position : p; })
                        : null;
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.Fingerprints, data));
        };
        return FingerprintsEnroll;
    }(Enroller));

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
    var TimeOtpEnroll = /** @class */ (function (_super) {
        __extends(TimeOtpEnroll, _super);
        /** Constructs a new One-Time Password enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function TimeOtpEnroll(context) {
            return _super.call(this, context) || this;
        }
        /**
         * Converts a secret key to a Key URI, which will be encode as a QR Code image to scan.
         * @param key - a secret key to convert to a Key URI string.
         * @returns - a promise to return a Key URI string
         * @remarks
         * For Push Notifications fo AD users, make sure the user's token has an `ad_guid` claim.
         * You may need to use `ClaimsService.GetClaims()` method to append this claim to an existing token.
         */
        TimeOtpEnroll.prototype.createKeyUri = function (key) {
            var type = "totp";
            var jwt = this.context.getJWT();
            var claims = core.JWT.claims(jwt);
            if (!claims)
                return Promise.reject(new Error('NoClaims'));
            var issuer = claims.dom || claims.iss; // will be used as a prefix of a label
            if (!issuer)
                return Promise.reject(new Error('NoIssuer'));
            var uid = claims.uid || claims["ad_guid"]; // required for Push OTP. Also needs TenantID.
            var username = this.context.getUser().name;
            var secret = core.Base32.fromBytes(key);
            return this.context.enrollService
                .GetEnrollmentData(core.User.Anonymous(), core.Credential.OneTimePassword)
                .then(function (data) {
                var otpData = JSON.parse(data);
                if (!otpData)
                    return Promise.reject(new Error("NoEnrollmentData"));
                var pushSupported = uid && otpData.pn_tenant_id;
                var uri = new core.Url("otpauth://" + type, issuer + ":" + username, {
                    secret: secret,
                    issuer: issuer,
                    apikey: otpData.pn_api_key,
                    tenantid: pushSupported ? otpData.pn_tenant_id : undefined,
                    useruuid: pushSupported ? uid : undefined,
                });
                return uri.href;
            });
        };
        /**
         * Sends an verification code using SMS to the user's device.
         * @param key - a secret key to "seed" an OTP generator and start generating verification codes.
         * @param phoneNumber - a phone number to send a current verification code to.
         */
        TimeOtpEnroll.prototype.sendVerificationCode = function (key, phoneNumber) {
            return this.context.enrollService
                .CustomAction(core.Ticket.None(), this.context.getUser(), new core.Credential(core.Credential.OneTimePassword, {
                key: core.Base64Url.fromBytes(key),
                phoneNumber: phoneNumber,
            }), CustomAction.SendSMSRequest)
                .then();
        };
        /**
         * Enrolls One-Time Password using a software TOTP (e.g. DigitalPersona app, Google Authenticator etc.)
         * @param code - a verification code entered by a user.
         * @param key - a secret key used to "seed" an OTP generator.
         * @param phoneNumber - a phone number the verification code was sent to
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        TimeOtpEnroll.prototype.enrollSoftwareOtp = function (code, key, phoneNumber) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.OneTimePassword, {
                otp: code,
                key: core.Base64Url.fromBytes(key),
                phoneNumber: phoneNumber,
            }));
        };
        /**
         * Enrolls a hardware TOTP token.
         * @param code - a verification code entered by a user.
         * @param serialNumber - a serial number of the TOTP token.
         * @param counter - an optional counter displayed on some token models.
         * @param timer - an optional timer displayed on some token models
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        TimeOtpEnroll.prototype.enrollHardwareOtp = function (code, serialNumber, counter, timer) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.OneTimePassword, {
                otp: code,
                serialNumber: serialNumber,
                counter: counter,
                timer: timer,
            }));
        };
        /** Deletes the OTP enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        TimeOtpEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.OneTimePassword));
        };
        return TimeOtpEnroll;
    }(Enroller));

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
    var PasswordEnroll = /** @class */ (function (_super) {
        __extends(PasswordEnroll, _super);
        /** Constructs a new password enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function PasswordEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a password change availability.
         * @returns a fulfilled promise when a password can be changed, a rejected promise otherwise.
         */
        PasswordEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.Password);
        };
        /**
         * Changes a password.
         * @param newPassword - a new password.
         * @param oldPassword - a password to replace. Must match the existing password.
         * @returns a promise to perform the password change or reject in case of an error.
         */
        PasswordEnroll.prototype.enroll = function (newPassword, oldPassword) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.Password, { oldPassword: oldPassword, newPassword: newPassword }));
        };
        /**
         * Resets a password.
         * @param newPassword - a new password which will replace any existing password.
         * @returns a promise to perform the password reset or reject in case of an error.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        PasswordEnroll.prototype.reset = function (newPassword) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.Password, newPassword));
        };
        /**
         * Creates a new strong password with good complexity properties.
         * @returns a promise to return a randomized password.
         * @remarks
         * DigitalPersona AD Server supports password randomization only for ActiveDirectory users.
         * DigitalPersona LDS Server supports password randomization only for DigitalPersona users (formerly "Altus Users").
         */
        PasswordEnroll.prototype.randomize = function () {
            return this.context.enrollService.CustomAction(new core.Ticket(this.context.securityOfficer || ""), this.context.getUser(), new core.Credential(core.Credential.Password), CustomAction$1.PasswordRandomization);
        };
        return PasswordEnroll;
    }(Enroller));

    /**
     * Personal Identification Number (PIN) enrollment API.
     */
    var PinEnroll = /** @class */ (function (_super) {
        __extends(PinEnroll, _super);
        /** Constructs a new PIN enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function PinEnroll(context) {
            return _super.call(this, context) || this;
        }
        /** Reads a PIN enrollment availability.
         * @returns a fulfilled promise when a PIN can be enrolled, a rejected promise otherwise.
         */
        PinEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.PIN);
        };
        /** Enrolls a PIN.
         * @param pin - a Personal Identification Number (PIN).
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        PinEnroll.prototype.enroll = function (pin) {
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.PIN, pin));
        };
        /** Deletes the PIN enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        PinEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.PIN));
        };
        return PinEnroll;
    }(Enroller));

    /**
     * Security Questions enrollment API.
     */
    var SecurityQuestionsEnroll = /** @class */ (function (_super) {
        __extends(SecurityQuestionsEnroll, _super);
        /** Constructs a new Security Questions enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         */
        function SecurityQuestionsEnroll(context) {
            return _super.call(this, context) || this;
        }
        /**
         * Reads enrolled Security Questions.
         * @returns a promise to return a collection of enrolled Security Questions.
         */
        SecurityQuestionsEnroll.prototype.getEnrolledQuestions = function () {
            return this.context.enrollService
                .GetEnrollmentData(this.context.getUser(), core.Credential.SecurityQuestions)
                .then(function (data) {
                return JSON.parse(core.Utf8.fromBase64Url(data))
                    .map(function (item) { return core.Question.fromJson(item); });
            });
        };
        /** Reads a Security Questions enrollment availability.
         * @returns a fulfilled promise when Security Questions can be enrolled, a rejected promise otherwise.
         */
        SecurityQuestionsEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.SecurityQuestions);
        };
        /**
         * Enrolls Security Questions.
         * @param questionsWithAnswers - a colelction of user's answers to Security Questions.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        SecurityQuestionsEnroll.prototype.enroll = function (questionsWithAnswers) {
            var equal = function (a, b) {
                return a.question.number === b.question.number;
            };
            var unique = function (val, idx, arr) {
                return arr.findIndex(function (qa) { return equal(qa, val); }) === idx;
            };
            var data = questionsWithAnswers
                .filter(function (qa) { return qa.question.number === qa.answer.number; })
                .filter(unique)
                .sort(function (a, b) { return b.question.number - a.question.number; }); // server requires reverse order
            return _super.prototype._enroll.call(this, new core.Credential(core.Credential.SecurityQuestions, data));
        };
        /** Deletes the Security Question enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        SecurityQuestionsEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.SecurityQuestions));
        };
        return SecurityQuestionsEnroll;
    }(Enroller));

    /**
     * Universal Second Factor (U2F) enrollment API.
     */
    var U2FEnroll = /** @class */ (function (_super) {
        __extends(U2FEnroll, _super);
        /** Constructs a new U2F enrollment API object.
         * @param context - an {@link EnrollmentContext|enrollment context}.
         * @param appId - an AppID of the service.
         */
        function U2FEnroll(context, appId) {
            var _this = _super.call(this, context) || this;
            if (!appId)
                throw new Error("appId");
            _this.appId = appId;
            return _this;
        }
        /** Reads a U2F enrollment availability.
         * @returns a fulfilled promise when a U2F can be enrolled, a rejected promise otherwise.
         */
        U2FEnroll.prototype.canEnroll = function () {
            return _super.prototype._canEnroll.call(this, core.Credential.U2F);
        };
        /**
         * Enrolls a U2F token.
         * @returns a promise to perform the enrollment or reject in case of an error.
         */
        U2FEnroll.prototype.enroll = function () {
            var _this = this;
            var version = "U2F_V2";
            var appId = this.appId;
            var timestamp = Math.round(new Date().getTime() / (U2FEnroll.TIME_WINDOW * 1000));
            var challenge = core.Base64Url.fromUtf16(timestamp.toString());
            var registerRequests = [{ version: version, appId: appId, challenge: challenge }];
            return u2fApi.register(registerRequests, [], U2FEnroll.TIMEOUT)
                .then(function (response) {
                return _super.prototype._enroll.call(_this, new core.Credential(core.Credential.U2F, __assign({ version: version, appId: appId }, response)));
            });
        };
        /** Deletes the U2F enrollment.
         * @returns a promise to delete the enrollment or reject in case of an error.
         */
        U2FEnroll.prototype.unenroll = function () {
            return _super.prototype._unenroll.call(this, new core.Credential(core.Credential.U2F));
        };
        U2FEnroll.TIMEOUT = 20;
        U2FEnroll.TIME_WINDOW = 30;
        return U2FEnroll;
    }(Enroller));

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
