import { __extends } from "tslib";
import { Credential, Question, Utf8 } from '@digitalpersona/core';
import { Enroller } from '../../private';
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
            .GetEnrollmentData(this.context.getUser(), Credential.SecurityQuestions)
            .then(function (data) {
            return JSON.parse(Utf8.fromBase64Url(data))
                .map(function (item) { return Question.fromJson(item); });
        });
    };
    /** Reads a Security Questions enrollment availability.
     * @returns a fulfilled promise when Security Questions can be enrolled, a rejected promise otherwise.
     */
    SecurityQuestionsEnroll.prototype.canEnroll = function () {
        return _super.prototype._canEnroll.call(this, Credential.SecurityQuestions);
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
        return _super.prototype._enroll.call(this, new Credential(Credential.SecurityQuestions, data));
    };
    /** Deletes the Security Question enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    SecurityQuestionsEnroll.prototype.unenroll = function () {
        return _super.prototype._unenroll.call(this, new Credential(Credential.SecurityQuestions));
    };
    return SecurityQuestionsEnroll;
}(Enroller));
export { SecurityQuestionsEnroll };
//# sourceMappingURL=enroll.js.map