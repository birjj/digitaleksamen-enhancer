import { z } from "zod";
import { ContentSchema } from "./content.schema";

/** Represents a row in a matrix question */
export const MatrixAnswerSchema = z.object({
  content: ContentSchema,
  correctColumn: z.number(),
});
export type MatrixAnswerSchema = z.infer<typeof MatrixAnswerSchema>;

/** Represents a matrix question, containing content and rows of questions, each consisting of a number of questions, one of which can be correct */
export const MatrixQuestionSchema = z.object({
  type: z.literal("matrix"),
  /** the title of each column, e.g. ["Sandt", "Falskt"] */
  columns: z.array(ContentSchema),
  content: ContentSchema,
  answers: z.array(MatrixAnswerSchema).default([]),
});
export type MatrixQuestionSchema = z.infer<typeof MatrixQuestionSchema>;
