import { z } from "zod";
import { BasicQuestionSchema } from "./question-basic.schema";
import { MatrixQuestionSchema } from "./question-matrix.schema";

export const QuestionSchema = z.discriminatedUnion("type", [
  BasicQuestionSchema,
  MatrixQuestionSchema,
]);
export type QuestionSchema = z.infer<typeof QuestionSchema>;
