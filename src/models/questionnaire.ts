import { atom } from "nanostores";
import { type QuestionnaireSchema } from "../schemas/questionnaire.schema";
import { Question } from "./question";
import { UploadState } from "./shared";

export class Questionnaire {
  id?: string;
  schema: QuestionnaireSchema;
  files: { [k: string]: File };
  questions: Question[];

  $error = atom<Error | null>(null);
  $status = atom<UploadState>(UploadState.NONE);
  $progress = atom(0);

  constructor(schema: QuestionnaireSchema, files: { [k: string]: File }) {
    this.schema = schema;
    this.files = files;
    this.questions = schema.questions.map(Question.fromSchema);
  }
}
