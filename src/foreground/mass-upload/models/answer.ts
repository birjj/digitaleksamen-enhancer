import {
  addBasicAnswer,
  addMatrixRow,
  markBasicAnswerAsCorrect,
  markMatrixAnswerAsCorrect,
} from "../api/answers";
import type { apiMatrixQuestion } from "../api/questions";
import { setContentWithImages } from "../api/shared";
import type { Manifest } from "./manifest";
import type Question from "./question";
import type { BasicQuestion, MatrixQuestion } from "./question";
import type { BasicQuestionSchema, MatrixQuestionSchema } from "./schemas";

export abstract class Answer {
  constructor() {}
  abstract upload(parent: Question, context: Manifest): Promise<void>;
}

export class BasicAnswer extends Answer {
  externalData: Partial<{ id: string; contentId: string }> = {};
  order: number;
  schema?: BasicQuestionSchema["answers"][0];

  constructor(order: number) {
    super();
    this.order = order;
  }

  static fromSchema(data: BasicQuestionSchema["answers"][0], order: number) {
    const a = new BasicAnswer(order);
    a.schema = data;
    return a;
  }

  /** Uploads our local state to the remote database */
  async upload(parent: BasicQuestion, context: Manifest) {
    if (!this.schema) {
      throw new Error("Can't upload a BasicAnswer without a schema");
    }
    if (!this.externalData.id) {
      await this.createSelf(parent);
    }

    await setContentWithImages(
      this.externalData.contentId!,
      this.schema.content,
      context.files
    );

    if (this.schema.correct) {
      await markBasicAnswerAsCorrect(this.externalData.id!);
    }
  }

  /** Creates ourselves in the remote database */
  private async createSelf(parent: BasicQuestion) {
    if (!parent.externalData.id) {
      throw new Error(
        "Cannot create BasicQuestion when parent doesn't have ID"
      );
    }
    const resp = await addBasicAnswer(parent.externalData.id, this.order);
    this.externalData.id = resp.Id;
    this.externalData.contentId = resp.ContentId;
  }
}

export class MatrixAnswer extends Answer {
  externalData: Partial<{ id: string; contentId: string }> = {};
  order: number;
  schema?: MatrixQuestionSchema["answers"][0];

  constructor(order: number) {
    super();
    this.order = order;
  }

  static fromSchema(data: MatrixQuestionSchema["answers"][0], order: number) {
    const a = new MatrixAnswer(order);
    a.schema = data;
    return a;
  }

  static fromApiData(data: apiMatrixQuestion["Items"][0]) {
    const a = new MatrixAnswer(data.Order);
    a.setApiData(data);
    return a;
  }

  setApiData(data: apiMatrixQuestion["Items"][0]) {
    this.order = data.Order;
    this.externalData.id = data.Id;
    this.externalData.contentId = data.FullContent.Id;
  }

  /** Uploads our local state to the remote database */
  async upload(parent: MatrixQuestion, context: Manifest) {
    if (!this.schema) {
      throw new Error("Can't upload a MatrixAnswer without a schema");
    }
    if (!parent.externalData.columnIds) {
      throw new Error(
        "Can't upload a MatrixAnswer when parent question doesn't have options"
      );
    }
    if (!this.externalData.id) {
      await this.createSelf(parent);
    }

    await setContentWithImages(
      this.externalData.contentId!,
      this.schema.content,
      context.files
    );

    const columnId = parent.externalData.columnIds[this.schema.correctColumn];
    if (!columnId) {
      throw new Error(
        `Attempted to set MatrixAnswer column to ${this.schema.correctColumn}, but parent question only has ${parent.externalData.columnIds.length} columns`
      );
    }
    await markMatrixAnswerAsCorrect(this.externalData.id!, columnId);
  }

  /** Creates ourselves in the remote database */
  private async createSelf(parent: MatrixQuestion) {
    if (!parent.externalData.id) {
      throw new Error(
        "Cannot create BasicQuestion when parent doesn't have ID"
      );
    }
    const resp = await addMatrixRow(parent.externalData.id, this.order);
    this.externalData.id = resp.Id;
    this.externalData.contentId = resp.ContentId;
  }
}
