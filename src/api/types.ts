import { Questionnaire } from "../models/questionnaire";

export type QuestionnaireUploader = (question: Questionnaire) => Promise<void>;
