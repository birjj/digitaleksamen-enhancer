import { atom } from "nanostores";
import { BasicAnswer, type Answer, MatrixAnswer } from "./answer";
import { type QuestionSchema } from "../schemas/question.schema";
import { type BasicQuestionSchema } from "../schemas/question-basic.schema";
import { MatrixQuestionSchema } from "../schemas/question-matrix.schema";
import { UploadState } from "./shared";

export enum QuestionType {
  BASIC,
  MATRIX,
}

export abstract class Question {
  abstract type: QuestionType;
  content: string;
  answers: Answer[] = [];

  $status = atom<UploadState>(UploadState.NONE);
  $name = atom("");

  static fromSchema(data: QuestionSchema) {
    switch (data.type) {
      case "basic":
        return BasicQuestion.fromSchema(data);
      case "matrix":
        return MatrixQuestion.fromSchema(data);
    }
  }
}

export class BasicQuestion extends Question {
  type = QuestionType.BASIC;
  answers: BasicAnswer[] = [];

  static fromSchema(data: BasicQuestionSchema) {
    const q = new BasicQuestion();
    q.$name.set(`BasicQuestion: ${data.content}`);
    q.content = data.content;
    q.answers = data.answers.map((a, i) => BasicAnswer.fromSchema(a));
    return q;
  }
}
export class MatrixQuestion extends Question {
  type = QuestionType.MATRIX;
  answers: MatrixAnswer[] = [];
  columns: string[];

  static fromSchema(data: MatrixQuestionSchema) {
    const q = new MatrixQuestion();
    q.$name.set(`MatrixQuestion: ${data.content}`);
    q.content = data.content;
    q.answers = data.answers.map((a) => MatrixAnswer.fromSchema(a));
    q.columns = data.columns;
    return q;
  }
}
