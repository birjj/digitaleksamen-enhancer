import { Questionnaire } from "./questionnaire";

export interface API {
  uploadQuestionnaire(question: Questionnaire): Promise<void>;
}
