import { Env } from '../../test'
import { SecurityQuestionsEnroll } from '.'
import { User, JSONWebToken, Question, Answer } from '@digitalpersona/core';
import { AuthService, EnrollService } from '@digitalpersona/services';
import { PasswordAuth } from '@digitalpersona/authentication';

describe("Questions Token: ", ()=>
{
    let api: SecurityQuestionsEnroll;
    let officer: JSONWebToken;

    const user: User = new User("alpha\\administrator");

    beforeEach(async ()=>{
        api = new SecurityQuestionsEnroll(
            new EnrollService(Env.EnrollServerEndpoint)
        );
        const passwordAuth = new PasswordAuth(new AuthService(Env.AuthServerEndpoint));
        officer = await passwordAuth.authenticate(user, "aaaAAA123");
    })

    it("must enroll", async () => {
        if (!Env.Integration) return;
        const questions = [1, 2, 3].map(n => new Question(n, 9, 1, 1033));
        const answers = [2,3,1].map(n => new Answer(n, "aaaaaa"));

        await expectAsync(api.enroll(officer, questions, answers)).toBeResolved();
    })
})
