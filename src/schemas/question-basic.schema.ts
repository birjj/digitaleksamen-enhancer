import { z } from "zod";
import { ContentSchema } from "./content.schema";

/** Represents an answer to a basic question */
export const BasicAnswerSchema = z.object({
  content: ContentSchema,
  correct: z.boolean().default(false),
});
export type BasicAnswerSchema = z.infer<typeof BasicAnswerSchema>;

/** Represents a basic question, containing only content and multiple answers */
export const BasicQuestionSchema = z.object({
  type: z.literal("basic"),
  content: ContentSchema,
  answers: z.array(BasicAnswerSchema).default([]),
});
export type BasicQuestionSchema = z.infer<typeof BasicQuestionSchema>;
