import { type Questionnaire } from "../models/questionnaire";

export type QuestionnaireUploader = (question: Questionnaire) => Promise<void>;

export type APIProvider = {
  uploadQuestionnaire: QuestionnaireUploader;
  uploadQuestionsToCurrentQuestionnaire: (
    questions: Questionnaire
  ) => Promise<void>;
  getQuestionnaireLink: (model: Questionnaire) => string;
};
