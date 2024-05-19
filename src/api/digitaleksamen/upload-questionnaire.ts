import { UploadState } from "../../models/shared";
import { type QuestionnaireUploader } from "../types";
import {
  clearQuestionnaire,
  createQuestionnaire,
  setQuestionnaireName,
} from "./interface/questionnaire";
import { logError, logInfo, logSuccess } from "../log";
import { uploadQuestion } from "./upload-questions";

const uploadQuestionnaire: QuestionnaireUploader = async (model) => {
  try {
    model.$status.set(UploadState.UPLOADING);

    // re-use the questionnaire ID if possible, to avoid clogging up the list if we error
    if (!model.id) {
      logInfo(`Creating new questionnaire`);
      model.id = await createQuestionnaire();
    } else {
      logInfo(`Clearing existing questionnaire ${model.id}`);
      await clearQuestionnaire(model.id);
    }

    // set info on the questionnaire itself
    if (model.schema.name) {
      await setQuestionnaireName(model.id!, model.schema.name);
    }

    // upload each of the questions
    for (let i = 0; i < model.questions.length; ++i) {
      await uploadQuestion(model, model.questions[i], i);
    }
    model.$status.set(UploadState.SUCCESS);
    logSuccess(`Finished uploading questionnaire ${model.id}`);
  } catch (e) {
    console.error(e);
    logError(e instanceof Error ? e.toString() : `${e}`);
    model.$status.set(UploadState.ERROR);
  }
};

export default uploadQuestionnaire;
