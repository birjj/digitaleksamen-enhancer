import { Questionnaire } from "../../../models/questionnaire";
import {
  deleteQuestionGroup,
  type apiBasicQuestion,
  type apiMatrixQuestion,
} from "./questions";
import { callAPI, callJSON } from "../shared";

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

type createQuestionnaireOptions = {
  manualScoring: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
};
/** Creates a new empty questionnaire */
export async function createQuestionnaire(
  opts: Partial<createQuestionnaireOptions> = {}
) {
  const options: createQuestionnaireOptions = {
    manualScoring: false,
    randomizeQuestions: false,
    randomizeOptions: false,
    ...opts,
  };
  const response = await callAPI(`/create`, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    body: new URLSearchParams({
      manualScoring: "" + options.manualScoring,
      randomizeQuestions: "" + options.randomizeQuestions,
      randomizeOptions: "" + options.randomizeOptions,
    }),
  });
  const id = getQuestionnaireIdFromUrl(response.url);
  if (!id) {
    throw new Error(
      `Failed to create questionnaire: couldn't parse ID from URL '${response.url}'`
    );
  }

  // questionnaires are created initially with a single empty question in them; we don't want that
  await clearQuestionnaire(id);

  return id;
}

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

/** Deletes all questions in the given questionnaire */
export async function clearQuestionnaire(id: string) {
  const questionnaire = await getQuestionnaire(id);
  for (let group of questionnaire.QuestionGroups) {
    await deleteQuestionGroup(group.Id);
  }
}

/** Sets the title of the given questionnaire */
export async function setQuestionnaireName(id: string, name: string) {
  await callAPI(`/data/questionnaire/${id}`, {
    method: "PUT",
    mode: "cors",
    credentials: "include",
    body: JSON.stringify(name),
    headers: { "Content-Type": "application/json" },
  });
}

export function getQuestionnaireIdFromUrl(url = location.pathname) {
  const [, questionnaireId] = /\/edit\/([^\/]+)\/?/.exec(url) || [];
  return questionnaireId || null;
}

export function getQuestionnaireLink(model: Questionnaire) {
  if (!model.id) {
    throw new Error("Cannot get URL for model without id");
  }
  return `/edit/${model.id}`;
}
