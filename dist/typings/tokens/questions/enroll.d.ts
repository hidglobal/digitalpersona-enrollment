import { Question, Answer } from '@digitalpersona/core';
import { Enroller } from '../../private';
import { EnrollmentContext } from '../..';
/**
 * Maps a security question to its corresponding answer.
 */
export interface QuestionWithAnswer {
    /** A security question */
    question: Question;
    /** An answer to the security question. */
    answer: Answer;
}
/**
 * Security Questions enrollment API.
 */
export declare class SecurityQuestionsEnroll extends Enroller {
    /** Constructs a new Security Questions enrollment API object.
     * @param context - an {@link EnrollmentContext|enrollment context}.
     */
    constructor(context: EnrollmentContext);
    /**
     * Reads enrolled Security Questions.
     * @returns a promise to return a collection of enrolled Security Questions.
     */
    getEnrolledQuestions(): Promise<Question[]>;
    /** Reads a Security Questions enrollment availability.
     * @returns a fulfilled promise when Security Questions can be enrolled, a rejected promise otherwise.
     */
    canEnroll(): Promise<void>;
    /**
     * Enrolls Security Questions.
     * @param questionsWithAnswers - a colelction of user's answers to Security Questions.
     * @returns a promise to perform the enrollment or reject in case of an error.
     */
    enroll(questionsWithAnswers: QuestionWithAnswer[]): Promise<void>;
    /** Deletes the Security Question enrollment.
     * @returns a promise to delete the enrollment or reject in case of an error.
     */
    unenroll(): Promise<void>;
}
