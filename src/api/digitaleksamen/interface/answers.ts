import { callAPI, callJSON } from "../shared";

export type apiBasicAnswer = {
  BasicQuestionId: string;
  ContentId: string;
  Correct: boolean;
  Created: string;
  Deleted: string | null;
  Id: string;
  Modified: string;
  Order: number;
  Weight: number;
};
/** Adds an answer entry to a basic question, returning the relevant answer and content IDs */
export async function addBasicAnswer(questionId: string, order: number) {
  if (!questionId) {
    throw new Error(
      "Attempted to add answer to a question without specifying ID"
    );
  }

  const body = await callJSON<apiBasicAnswer>(
    `/data/questionoption?questionId=${questionId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body.ContentId || !body.Id) {
    `Failed to add answer to question, got failed response from server: ${JSON.stringify(
      body
    )}`;
  }
  return body as apiBasicAnswer;
}

export async function markBasicAnswerAsCorrect(answerId: string) {
  if (!answerId) {
    throw new Error(
      "Attempted to mark basic answer as correct without specifying ID"
    );
  }

  await callAPI(`/data/questionoption/${answerId}`, {
    body: null,
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });
  return true;
}

export type apiMatrixRow = {
  ContentId: string;
  Created: string;
  Deleted: string | null;
  ExternalKey: null;
  Id: string;
  MatrixQuestionId: string;
  MatrixQuestionOptionId: string;
  Modified: string;
  Order: number;
};
/** Adds a row to a matrix question */
export async function addMatrixRow(questionId: string, order = 0) {
  if (!questionId) {
    throw new Error(
      "Attempted to add matrix row without specifying question ID"
    );
  }

  const body = await callJSON<apiMatrixRow>(
    `/data/matrixquestionitem?questionId=${questionId}&order=${order}`,
    {
      body: null,
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body.ContentId || !body.Id) {
    throw new Error(
      `Failed to add matrix row, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiMatrixRow;
}

export async function markMatrixAnswerAsCorrect(
  rowId: string,
  columnId: string
) {
  if (!rowId || !columnId) {
    throw new Error(
      "Attempted to mark matrix answer as correct without specifying both row and option ID"
    );
  }

  await callAPI(`/data/matrixquestionitem/${rowId}?optionId=${columnId}`, {
    body: null,
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });
  return true;
}
