import { useModalStyles } from "@chakra-ui/react";
import {
  QuestionType,
  type Question,
  MatrixQuestion,
  BasicQuestion,
} from "../../models/question";
import { type Questionnaire } from "../../models/questionnaire";
import { UploadState } from "../../models/shared";
import { type QuestionnaireUploader } from "../types";
import {
  addBasicAnswer,
  addMatrixRow,
  markBasicAnswerAsCorrect,
  markMatrixAnswerAsCorrect,
} from "./answers";
import { setContentWithImages } from "./content";
import { clearQuestionnaire, createQuestionnaire } from "./questionnaire";
import {
  addBasicQuestion,
  addMatrixColumn,
  addMatrixQuestion,
  addQuestionGroup,
  deleteMatrixColumn,
  deleteMatrixRow,
} from "./questions";
import { logError, logInfo, logSuccess } from "../log";

export const uploadQuestionnaire: QuestionnaireUploader = async (model) => {
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

async function uploadQuestion(
  questionnaire: Questionnaire,
  model: Question,
  order: number
) {
  try {
    model.$status.set(UploadState.UPLOADING);

    logInfo(`Adding question group to ${questionnaire.id}`);
    const group = await addQuestionGroup(questionnaire.id!, order);
    switch (model.type) {
      case QuestionType.BASIC:
        await uploadBasicQuestion(
          group.Id,
          model as BasicQuestion,
          order,
          questionnaire.files
        );
        break;
      case QuestionType.MATRIX:
        await uploadMatrixQuestion(
          group.Id,
          model as MatrixQuestion,
          order,
          questionnaire.files
        );
        break;
    }

    model.$status.set(UploadState.SUCCESS);
  } catch (e) {
    model.$status.set(UploadState.ERROR);
    throw e;
  }
}

/** Upload a basic question by adding it, setting its content and adding each of its answers */
async function uploadBasicQuestion(
  groupId: string,
  model: BasicQuestion,
  order: number,
  files: { [k: string]: File }
) {
  try {
    model.$status.set(UploadState.UPLOADING);
    logInfo(`Uploading basic question ${order}`);

    const question = await addBasicQuestion(groupId, order);
    await setContentWithImages(question.FullContent.Id, model.content, files);

    for (let i = 0; i < model.answers.length; ++i) {
      const remoteAnswer = await addBasicAnswer(question.Id, i);
      await setContentWithImages(
        remoteAnswer.ContentId,
        model.answers[i].content,
        files
      );
      if (model.answers[i].correct) {
        await markBasicAnswerAsCorrect(remoteAnswer.Id);
      }
    }

    model.$status.set(UploadState.SUCCESS);
    logSuccess(`Finished uploading basic question ${order}`);
  } catch (e) {
    model.$status.set(UploadState.ERROR);
    throw e;
  }
}

/** Upload a matrix question by adding it, setting its content, adding its columns, and adding each of its answers */
async function uploadMatrixQuestion(
  groupId: string,
  model: MatrixQuestion,
  order: number,
  files: { [k: string]: File }
) {
  try {
    model.$status.set(UploadState.UPLOADING);
    logInfo(`Uploading matrix question ${order}`);

    // add the question and delete all of its pre-defined rows/columns
    console.log("Matrix question", model);
    const question = await addMatrixQuestion(groupId, order);
    await setContentWithImages(question.FullContent.Id, model.content, files);
    for (let i = 0; i < question.Options.length; ++i) {
      await deleteMatrixColumn(question.Options[i].Id);
    }
    for (let i = 0; i < question.Items.length; ++i) {
      await deleteMatrixRow(question.Items[i].Id);
    }

    // then add our own
    const columnIds: string[] = [];
    for (let i = 0; i < model.columns.length; ++i) {
      const column = await addMatrixColumn(question.Id, i);
      await setContentWithImages(column.ContentId, model.columns[i], files);
      columnIds.push(column.Id);
    }
    for (let i = 0; i < model.answers.length; ++i) {
      const row = await addMatrixRow(question.Id, i);
      await setContentWithImages(
        row.ContentId,
        model.answers[i].content,
        files
      );
      await markMatrixAnswerAsCorrect(
        row.Id,
        columnIds[model.answers[i].correctColumn]
      );
    }

    model.$status.set(UploadState.SUCCESS);
    logSuccess(`Finished uploading matrix question ${order}`);
  } catch (e) {
    model.$status.set(UploadState.ERROR);
    throw e;
  }
}
