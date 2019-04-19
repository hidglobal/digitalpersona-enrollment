import { User, Credential, Answers, Question, SecurityQuestions, IEnrollService, JSONWebToken } from '@digitalpersona/access-management';
import { Enroller } from '../../private';

export class SecurityQuestionsEnroll extends Enroller
{
    constructor(
        enrollService: IEnrollService,
        securityOfficer?: JSONWebToken,
    ){
        super(enrollService, securityOfficer);
    }

    public canEnroll(user: User, securityOfficer?: JSONWebToken): Promise<void> {
        return super._canEnroll(user, Credential.SecurityQuestions, securityOfficer);
    }

    public enroll(
        user: JSONWebToken,
        questions: Question[],
        answers: Answers,
        securityOfficer?: JSONWebToken): Promise<void>
    {
        return super._enroll(user, new SecurityQuestions({ questions, answers }), securityOfficer);
    }

    public unenroll(user: JSONWebToken, securityOfficer?: JSONWebToken): Promise<void> {
        return super._unenroll(user, new SecurityQuestions({}), securityOfficer);
    }

}
