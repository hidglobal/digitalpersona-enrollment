import { User, Credential, JSONWebToken, Question, Answer, Utf8 } from '@digitalpersona/core';
import { IEnrollService } from '@digitalpersona/services';
import { Enroller } from '../../private';

export interface QuestionWithAnswer {
    question: Question;
    answer: Answer;
}
export class SecurityQuestionsEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public getEnrolledQuestions(user: User): Promise<Question[]>
    {
        return this.enrollService
            .GetEnrollmentData(user, Credential.SecurityQuestions)
            .then(data =>
                (JSON.parse(Utf8.fromBase64Url(data)) as object[])
                .map(item => Question.fromJson(item)));
    }

    public canEnroll(
        user: User,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._canEnroll(user, Credential.SecurityQuestions, securityOfficer);
    }

    public enroll(
        user: JSONWebToken,
        questionsWithAnswers: QuestionWithAnswer[],
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        const equal = (a: QuestionWithAnswer, b: QuestionWithAnswer) =>
            a.question.number === b.question.number;
        const unique = (val: QuestionWithAnswer, idx: number, arr: QuestionWithAnswer[]) =>
            arr.findIndex(qa => equal(qa, val)) === idx;

        const data = questionsWithAnswers
            .filter(qa => qa.question.number === qa.answer.number)
            .filter(unique)
            .sort((a, b) => b.question.number - a.question.number); // server requires reverse order

        return super._enroll(user, new Credential(Credential.SecurityQuestions, data), securityOfficer);
    }

    public unenroll(
        user: JSONWebToken,
        securityOfficer?: JSONWebToken,
    ): Promise<void>
    {
        return super._unenroll(user, new Credential(Credential.SecurityQuestions), securityOfficer);
    }

}
