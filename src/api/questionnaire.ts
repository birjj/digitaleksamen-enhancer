import { type apiBasicQuestion, type apiMatrixQuestion } from "./questions";
import { callJSON } from "./shared";

export type apiQuestionnaire = {
  Id: string;
  Name: string;
  Created: string;
  LastUpdated: string;
  HasError: boolean;
  ManualScoring: boolean;
  RandomizeQuestions: boolean;
  RandomizeOptions: boolean;
  Content: { Id: string; Text: string };
  QuestionGroups: {
    Id: string;
    Title: string;
    Order: number;
    FullContent: { Id: string; Text: string };
    ShowQuestionsOnSamePage: boolean;
    Questions: (apiMatrixQuestion | apiBasicQuestion)[];
    LastUpdated: string;
    ParametricsQuestions: unknown[];
    RavenQuestions: unknown[];
    BasicQuestions: apiBasicQuestion[];
    MatrixQuestions: apiMatrixQuestion[];
    ClozeQuestions: unknown[];
    OpenEndedQuestions: unknown[];
    TextQuestions: unknown[];
  }[];
};

/** Gets the full data of a given questionnaire */
export async function getQuestionnaire(questionnaireId: string) {
  if (!questionnaireId) {
    throw new Error("Attempted to get questionnaire without specifying ID");
  }

  const body = await callJSON<apiQuestionnaire>(
    `/data/questionnaire/${questionnaireId}/full`,
    {
      method: "GET",
      mode: "cors",
      credentials: "include",
    }
  );

  if (!body?.Id || !body.QuestionGroups) {
    throw new Error(
      `Failed to get questionnaire, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body as apiQuestionnaire;
}

export function getCurrentQuestionnaireId() {
  const [, questionnaireId] =
    /^\/edit\/([^\/]+)\/?/.exec(location.pathname) || [];
  return questionnaireId || null;
}
