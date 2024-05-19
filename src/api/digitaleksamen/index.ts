import { APIProvider } from "../types";
import { getQuestionnaireLink } from "./interface/questionnaire";
import uploadQuestionnaire from "./upload-questionnaire";
import uploadQuestionsToCurrentQuestionnaire from "./upload-questions";

const provider: APIProvider = {
  uploadQuestionnaire,
  uploadQuestionsToCurrentQuestionnaire,
  getQuestionnaireLink,
};
export default provider;
