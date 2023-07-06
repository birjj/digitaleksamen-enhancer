import { WritableAtom, atom } from "nanostores";
import {
  AnswerSchema,
  MatrixQuestionSchema,
  type BasicQuestionSchema,
  type QuestionSchema,
} from "./manifest";

export default class Question {
  id = crypto.randomUUID();
  answers: Answer[] = [];

  $progress = atom(0);
  $status = atom("Not uploaded");
  $name = atom("");
  $error = atom<Error | null>(null);

  static create(data: QuestionSchema) {
    switch (data.type) {
      case "basic":
        return new BasicQuestion(data);
      case "matrix":
        return new MatrixQuestion(data);
    }
  }
}

export class BasicQuestion extends Question {
  constructor(data: BasicQuestionSchema) {
    super();
    this.$name.set(data.content.value);
  }
}
export class MatrixQuestion extends Question {
  constructor(data: MatrixQuestionSchema) {
    super();
    this.$name.set(data.content.value);
  }
}

export class Answer {
  id = crypto.randomUUID();
}
