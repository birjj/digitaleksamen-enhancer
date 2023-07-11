import { callJSON } from "./shared";

export type apiQuestionGroup = {
  ContentId: string;
  Created: string;
  Id: string;
  Order: number;
  QuestionnaireId: string;
  ShowQuestionsOnSamePage: boolean;
  Title: string;
};
export async function addQuestionGroup(order: number = 0) {
  const [, questionnaireId] =
    /^\/edit\/([^\/]+)\//.exec(location.pathname) || [];
  if (!questionnaireId) {
    throw new Error(
      "Failed to read questionnaire ID when adding question group"
    );
  }

  const body = await callJSON<apiQuestionGroup>(
    `/data/questiongroup?questionnaireId=${questionnaireId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body?.ContentId || !body.Id) {
    throw new Error(
      `Failed to add question group, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiQuestionGroup;
}

export type apiBasicQuestion = {
  AllowMultipleAnswers: boolean;
  ExternalKey: null;
  FullContent: {
    Id: string;
    Text: string;
  };
  HelpInstructions: null;
  Id: string;
  LastUpdated: string;
  Options: never[];
  Order: number;
  PreserveOptionOrder: boolean;
  QuestionGroupId: string;
};
export async function addBasicQuestion(groupId: string, order = 0) {
  if (!groupId) {
    throw new Error(
      "Attempted to add basic question without specifying group ID"
    );
  }

  const body = await callJSON<apiBasicQuestion>(
    `/data/basicquestion?questionGroupId=${groupId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body.FullContent?.Id || !body.Id) {
    throw new Error(
      `Failed to add basic question, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiBasicQuestion;
}

export type apiMatrixQuestion = {
  AllowMultipleAnswers: boolean;
  ExternalKey: null;
  FullContent: {
    Id: string;
    Text: string;
  };
  HelpInstructions: null;
  Id: string;
  Items: {
    ExternalKey: null;
    FullContent: { Id: string; Text: string };
    Id: string;
    LastUpdated: string;
    MatrixQuestionOptionId: null;
    Order: number;
  }[];
  LastUpdated: string;
  Options: {
    FullContent: { Id: string; Text: string };
    Id: string;
    LastUpdated: string;
    Order: number;
  }[];
  Order: number;
  PreserveItemOrder: boolean;
  QuestionGroupId: string;
  Weights: {
    MatrixQuestionItemId: string;
    MatrixQuestionOptionId: string;
    Weight: number;
  }[];
};
export async function addMatrixQuestion(groupId: string, order = 0) {
  if (!groupId) {
    throw new Error(
      "Attempted to add matrix question without specifying group ID"
    );
  }

  const body = await callJSON<apiMatrixQuestion>(
    `/data/matrixquestion?questionGroupId=${groupId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body.FullContent?.Id || !body.Id || !body.Items || !body.Options) {
    throw new Error(
      `Failed to add matrix question, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiMatrixQuestion;
}

type apiMatrixColumn = {
  ContentId: string;
  Created: string;
  Deleted: string | null;
  Id: string;
  MatrixQuestionId: string;
  Modified: string;
  Order: number;
};
export async function addMatrixColumn(questionId: string, order = 0) {
  if (!questionId) {
    throw new Error(
      "Attempted to add matrix column without specifying question ID"
    );
  }

  const body = await callJSON<apiMatrixColumn>(
    `/data/matrixquestionoption?questionId=${questionId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body.ContentId || !body.Id) {
    throw new Error(
      `Failed to add matrix column, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiMatrixColumn;
}
