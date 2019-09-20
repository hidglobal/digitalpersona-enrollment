import { __extends } from "tslib";
import { Credential, Utf8 } from '@digitalpersona/core';
import { Enroller } from '../../private';
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
            .GetEnrollmentData(this.context.getUser(), Credential.SmartCard)
            .then(function (data) {
            return JSON.parse(Utf8.fromBase64Url(data));
        });
    };
    /** Reads a card enrollment availability.
     * @returns a fulfilled promise when a card can be enrolled, a rejected promise otherwise.
     */
    SmartCardEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.SmartCard);
    };
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    SmartCardEnroll.prototype.enroll = function (cardData) {
        return _super.prototype._enroll.call(this, new Credential(Credential.SmartCard, cardData));
    };
    /**
     * Deletes a specific smart card enrollment defined by its pubilc key hash.
     * @param keyHash - a key hash of the card. If not provided, all smartcard enrollments will be deleted.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    SmartCardEnroll.prototype.unenroll = function (keyHash) {
        return _super.prototype._unenroll.call(this, new Credential(Credential.SmartCard, keyHash));
    };
    return SmartCardEnroll;
}(Enroller));
export { SmartCardEnroll };
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
        return _super.prototype._canEnroll.call(this, Credential.ContactlessCard);
    };
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    ContactlessCardEnroll.prototype.enroll = function (cardData) {
        return _super.prototype._enroll.call(this, new Credential(Credential.ContactlessCard, cardData));
    };
    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    ContactlessCardEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.ContactlessCard));
    };
    return ContactlessCardEnroll;
}(Enroller));
export { ContactlessCardEnroll };
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
        return _super.prototype._canEnroll.call(this, Credential.ProximityCard);
    };
    /** Enrolls a card.
     * @param cardData - a card enrollment data obtained using {@link CardsReader.getCardEnrollData}.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    ProximityCardEnroll.prototype.enroll = function (cardData) {
        return _super.prototype._enroll.call(this, new Credential(Credential.ProximityCard, cardData));
    };
    /** Deletes the card enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    ProximityCardEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.ProximityCard));
    };
    return ProximityCardEnroll;
}(Enroller));
export { ProximityCardEnroll };
//# sourceMappingURL=enroll.js.map