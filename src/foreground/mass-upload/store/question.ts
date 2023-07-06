import { WritableAtom, atom } from "nanostores";
import {
  AnswerSchema,
  MatrixQuestionSchema,
  type BasicQuestionSchema,
  type QuestionSchema,
  type Manifest,
} from "./manifest";

// temporary for mocking purposes; remove later
const timeoutPromise = (t: number) => new Promise((res) => setTimeout(res, t));

export default abstract class Question {
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

  abstract uploadSelf(context: Manifest): Promise<void>;

  async upload(context: Manifest) {
    if (this.$progress.get() >= 1 && !this.$error.get()) {
      return;
    }
    try {
      this.$status.set("Uploading question");
      this.$progress.set(0);
      this.$error.set(null);

      await this.uploadSelf(context);
      for (let i = 0; i < this.answers.length; ++i) {
        const answer = this.answers[i];
        this.$status.set(`Uploading answer ${i + 1}/${this.answers.length}`);
        this.$progress.set((i + 1) / (this.answers.length + 1));
        await answer.upload(this, context);
      }
      this.$progress.set(1);
      this.$status.set("Uploaded");
    } catch (e) {
      this.$error.set(e);
      this.$status.set("Errored");
      throw e;
    }
  }
}

export class BasicQuestion extends Question {
  constructor(data: BasicQuestionSchema) {
    super();
    this.$name.set(data.content.value);
    this.answers = data.answers.map((a) => new BasicAnswer(a));
  }

  async uploadSelf(context: Manifest) {
    await timeoutPromise(1000 + Math.random() * 1000);
    if (Math.random() < 0.25) {
      throw new Error("Failed");
    }
  }
}
export class MatrixQuestion extends Question {
  constructor(data: MatrixQuestionSchema) {
    super();
    this.$name.set(data.content.value);
    this.answers = data.answers.map((a) => new MatrixAnswer(a));
  }

  async uploadSelf(context: Manifest) {
    await timeoutPromise(1000 + Math.random() * 1000);
    if (Math.random() < 0.25) {
      throw new Error("Failed");
    }
  }
}

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
class BasicAnswer extends Answer {
  constructor(data: AnswerSchema) {
    super();
  }
}
class MatrixAnswer extends Answer {
  constructor(data: AnswerSchema[]) {
    super();
  }
}
