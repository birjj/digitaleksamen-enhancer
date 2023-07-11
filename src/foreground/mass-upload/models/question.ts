import { atom } from "nanostores";
import { type Manifest } from "./manifest";
import {
  BasicQuestionSchema,
  MatrixQuestionSchema,
  QuestionSchema,
} from "./schemas";
import { BasicAnswer, type Answer, MatrixAnswer } from "./answer";
import {
  addBasicQuestion,
  addMatrixColumn,
  addMatrixQuestion,
  addQuestionGroup,
} from "../api/questions";
import { setContentWithImages } from "../api/content";

export default abstract class Question {
  externalData: Partial<{ id: string; contentId: string }> = {};
  answers: Answer[] = [];
  order = 0;
  schema?: BasicQuestionSchema | MatrixQuestionSchema;

  $progress = atom(0);
  $status = atom("Not uploaded");
  $name = atom("");
  $error = atom<Error | null>(null);

  static fromSchema(data: QuestionSchema, order = 0) {
    switch (data.type) {
      case "basic":
        return BasicQuestion.fromSchema(data, order);
      case "matrix":
        return MatrixQuestion.fromSchema(data, order);
    }
  }

  abstract uploadSelf(context: Manifest): Promise<void>;

  async upload(context: Manifest) {
    if (this.$progress.get() >= 1 && !this.$error.get()) {
      return;
    }
    if (!this.schema) {
      console.log("Question", this, "has no schema");
      throw new Error("Can't upload a question without a schema");
    }

    try {
      this.$status.set("Uploading question");
      this.$progress.set(0);
      this.$error.set(null);

      if (!this.externalData.id) {
        await this.uploadSelf(context);
      }

      await setContentWithImages(
        this.externalData.contentId!,
        this.schema.content,
        context.files
      );

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
  externalData: Partial<{ id: string; contentId: string }> = {};
  answers: BasicAnswer[] = [];
  schema?: BasicQuestionSchema = undefined;

  static fromSchema(data: BasicQuestionSchema, order: number) {
    const q = new BasicQuestion();
    q.$name.set(`BasicQuestion ${order}: ${data.content}`);
    q.answers = data.answers.map((a, i) => BasicAnswer.fromSchema(a, i));
    q.order = order;
    q.schema = data;
    return q;
  }

  async uploadSelf(context: Manifest) {
    const group = await addQuestionGroup(this.order);
    const question = await addBasicQuestion(group.Id, 0);
    this.externalData.id = question.Id;
    this.externalData.contentId = question.FullContent.Id;
  }
}
export class MatrixQuestion extends Question {
  externalData: Partial<{
    id: string;
    contentId: string;
    columns: { id: string; contentId: string }[];
  }> = {};
  answers: MatrixAnswer[] = [];
  schema?: MatrixQuestionSchema = undefined;

  static fromSchema(data: MatrixQuestionSchema, order: number) {
    const q = new MatrixQuestion();
    q.$name.set(`MatrixQuestion ${order}: ${data.content}`);
    q.answers = data.answers.map((a, i) => MatrixAnswer.fromSchema(a, i));
    q.order = order;
    q.schema = data;
    return q;
  }

  async uploadSelf(context: Manifest) {
    const group = await addQuestionGroup(this.order);
    const question = await addMatrixQuestion(group.Id, 0);
    this.externalData.id = question.Id;
    this.externalData.contentId = question.FullContent.Id;

    this.externalData.columns = question.Options.map((opt) => ({
      id: opt.Id,
      contentId: opt.FullContent.Id,
    }));
    await this.uploadColumns(context);

    for (let i = 0; i < question.Items.length; ++i) {
      const row = question.Items[i];
      this.answers[i]?.setApiData(row);
    }
  }

  async uploadColumns(context: Manifest) {
    this.externalData.columns = this.externalData.columns || [];
    for (let i = 0; i < this.schema!.columns.length; ++i) {
      if (!this.externalData.columns[i]) {
        const column = await addMatrixColumn(this.externalData.id!, i);
        this.externalData.columns[i] = {
          id: column.Id,
          contentId: column.ContentId,
        };
      }

      await setContentWithImages(
        this.externalData.columns[i].contentId,
        this.schema!.columns[i],
        context.files
      );
    }
  }
}
