import { type Questionnaire } from "../models/questionnaire";

export type QuestionnaireUploader = (question: Questionnaire) => Promise<void>;

export type APIProvider = {
  uploadQuestionnaire: QuestionnaireUploader;
  getQuestionnaireLink: (model: Questionnaire) => string;
};
