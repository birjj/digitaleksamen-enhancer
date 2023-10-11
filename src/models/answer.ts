import { atom } from "nanostores";
import { type BasicAnswerSchema } from "../schemas/question-basic.schema";
import { type MatrixAnswerSchema } from "../schemas/question-matrix.schema";
import { UploadState } from "./shared";

export abstract class Answer {
  $status = atom<UploadState>(UploadState.NONE);
}

export class BasicAnswer extends Answer {
  content: string;
  correct: boolean;

  static fromSchema(data: BasicAnswerSchema) {
    const a = new BasicAnswer();
    a.content = data.content;
    a.correct = data.correct;
    return a;
  }
}

export class MatrixAnswer extends Answer {
  content: string;
  correctColumn: number;

  static fromSchema(data: MatrixAnswerSchema) {
    const a = new MatrixAnswer();
    a.content = data.content;
    a.correctColumn = data.correctColumn;
    return a;
  }
}
