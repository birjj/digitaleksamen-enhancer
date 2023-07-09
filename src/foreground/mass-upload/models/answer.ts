import { timeoutPromise } from "../../utils";
import type { Manifest } from "./manifest";
import type Question from "./question";
import type { AnswerSchema } from "./schemas";

export class Answer {
  id = crypto.randomUUID();

  constructor() {}

  async upload(parent: Question, context: Manifest) {
    await timeoutPromise(1000 + Math.random() * 1000);
    if (Math.random() < 0.05) {
      throw new Error("Failed");
    }
  }
}
export class BasicAnswer extends Answer {
  constructor(data: AnswerSchema) {
    super();
  }
}
export class MatrixAnswer extends Answer {
  constructor(data: AnswerSchema[]) {
    super();
  }
}
