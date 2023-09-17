import { type QuestionnaireSchema } from "../schemas/questionnaire.schema";
import { Question } from "./question";

export class Questionnaire {
  schema: QuestionnaireSchema;
  files: { [k: string]: File };
  questions: Question[];

  constructor(schema: QuestionnaireSchema, files: { [k: string]: File }) {
    this.schema = schema;
    this.files = files;
    this.questions = schema.questions.map(Question.fromSchema);
  }
}
