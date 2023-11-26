import { APIProvider } from "../types";
import { getQuestionnaireLink } from "./interface/questionnaire";
import uploadQuestionnaire from "./upload-questionnaire";

const provider: APIProvider = {
  uploadQuestionnaire,
  getQuestionnaireLink,
};
export default provider;
