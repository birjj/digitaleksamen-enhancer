import { type BasicAnswerSchema } from "../schemas/question-basic.schema";
import { type MatrixAnswerSchema } from "../schemas/question-matrix.schema";

export abstract class Answer {}

export class BasicAnswer extends Answer {
  schema?: BasicAnswerSchema;

  static fromSchema(data: BasicAnswerSchema) {
    const a = new BasicAnswer();
    a.schema = data;
    return a;
  }
}

export class MatrixAnswer extends Answer {
  schema?: MatrixAnswerSchema;

  static fromSchema(data: MatrixAnswerSchema) {
    const a = new MatrixAnswer();
    a.schema = data;
    return a;
  }
}
