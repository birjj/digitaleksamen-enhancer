import { callAPI, callJSON, setContent } from "./shared";

export async function addQuestionGroup(order: number = 0) {
  const [, questionnaireId] =
    /^\/edit\/([^\/]+)\//.exec(location.pathname) || [];
  if (!questionnaireId) {
    throw new Error(
      "Failed to read questionnaire ID when adding question group"
    );
  }

  const body = await callJSON<{
    ContentId: string;
    Created: string;
    Id: string;
    Order: number;
    QuestionnaireId: string;
    ShowQuestionsOnSamePage: boolean;
    Title: string;
  }>(`/data/questiongroup?questionnaireId=${questionnaireId}&order=${order}`, {
    body: null,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!body?.ContentId || !body.Id) {
    throw new Error(
      `Failed to add question group, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return {
    contentId: body.ContentId,
    id: body.Id,
  };
}

export async function addBasicQuestion(groupId: string, order = 0) {
  if (!groupId) {
    throw new Error(
      "Attempted to add basic question without specifying group ID"
    );
  }

  const body = await callJSON<{
    AllowMultipleAnswers: boolean;
    ExternalKey: null;
    FullContent: {
      Id: string;
      Text: string;
    };
    HelpInstructions: null;
    Id: string;
    LastUpdated: string;
    Options: [];
    Order: number;
    PreserveOptionOrder: boolean;
    QuestionGroupId: string;
  }>(`/data/basicquestion?questionGroupId=${groupId}&order=${order}`, {
    body: null,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!body.FullContent?.Id || !body.Id) {
    throw new Error(
      `Failed to add basic question, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return {
    contentId: body.FullContent.Id,
    id: body.Id,
  };
}

export async function addMatrixQuestion(groupId: string, order = 0) {
  if (!groupId) {
    throw new Error(
      "Attempted to add matrix question without specifying group ID"
    );
  }

  const body = await callJSON<{
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
      Id: number;
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
  }>(`/data/matrixquestion?questionGroupId=${groupId}&order=${order}`, {
    body: null,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!body.FullContent?.Id || !body.Id || !body.Items || !body.Options) {
    throw new Error(
      `Failed to add matrix question, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return {
    contentId: body.FullContent.Id,
    id: body.Id,
    items: body.Items,
    options: body.Options,
  };
}
