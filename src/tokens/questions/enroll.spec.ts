import { User, JSONWebToken, Question, Answer } from '@digitalpersona/core';
import { AuthService, EnrollService } from '@digitalpersona/services';
import { PasswordAuth } from '@digitalpersona/authentication';

import { Env } from '../../test';
import { EnrollmentContext } from '../../enrollmentContext';
import { SecurityQuestionsEnroll } from '.';

describe("Questions Token: ", () =>
{
    let api: SecurityQuestionsEnroll;
    let officer: JSONWebToken;
    let context: EnrollmentContext;

    const user: User = new User("alpha\\administrator");
    const service = new EnrollService(Env.EnrollServerEndpoint);

    beforeEach(async () => {
        if (Env.Integration) {
            const passwordAuth = new PasswordAuth(new AuthService(Env.AuthServerEndpoint));
            officer = await passwordAuth.authenticate(user, "aaaAAA123");
        }
        context = new EnrollmentContext(service, user, officer);
        api = new SecurityQuestionsEnroll(context);
    });

    it("must enroll", async () => {
        if (!Env.Integration) return;
        const answers = [1, 2, 3].map(n => ({
            question: new Question(n, 9, 1, 1033),
            answer: new Answer(n, 'aaaaaa'),
        }));

        await expectAsync(api.enroll(answers)).toBeResolved();
    });
});
