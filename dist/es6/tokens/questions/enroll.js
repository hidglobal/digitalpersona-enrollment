import { Credential, Question, Utf8 } from '@digitalpersona/core';
import { Enroller } from '../../private';
/**
 * Security Questions enrollment API.
 */
export class SecurityQuestionsEnroll extends Enroller {
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
            .GetEnrollmentData(this.context.getUser(), Credential.SecurityQuestions)
            .then(data => JSON.parse(Utf8.fromBase64Url(data))
            .map(item => Question.fromJson(item)));
    }
    /** Reads a Security Questions enrollment availability.
     * @returns a fulfilled promise when Security Questions can be enrolled, a rejected promise otherwise.
     */
    canEnroll() {
        return super._canEnroll(Credential.SecurityQuestions);
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
        return super._enroll(new Credential(Credential.SecurityQuestions, data));
    }
    /** Deletes the Security Question enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll() {
        return super._unenroll(new Credential(Credential.SecurityQuestions));
    }
}
//# sourceMappingURL=enroll.js.map