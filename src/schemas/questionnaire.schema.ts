import { z } from "zod";
import { QuestionSchema } from "./question.schema";

export const QuestionnaireSchema = z.object({
  $version: z.string().default("1"),
  name: z.string().optional(),
  questions: z.array(QuestionSchema),
});
export type QuestionnaireSchema = z.infer<typeof QuestionnaireSchema>;
