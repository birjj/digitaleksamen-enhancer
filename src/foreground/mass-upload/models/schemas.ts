import { z } from "zod";
import { fromZodError } from "zod-validation-error";

/** Represents written content in the exam (i.e. content of a text field). You can use '{{ filename }}' to embed an image file */
const ContentSchema = z.string();
export type ContentSchema = z.infer<typeof ContentSchema>;

/** Represents a basic question, containing only content and multiple answers */
const BasicQuestionSchema = z.object({
  type: z.literal("basic"),
  content: ContentSchema,
  answers: z
    .array(
      z.object({
        content: ContentSchema,
        correct: z.boolean(),
      })
    )
    .default([]),
});
export type BasicQuestionSchema = z.infer<typeof BasicQuestionSchema>;

/** Represents a matrix question, containing content and rows of questions, each consisting of a number of questions, one of which can be correct */
const MatrixQuestionSchema = z.object({
  type: z.literal("matrix"),
  /** the title of each column, e.g. ["Sandt", "Falskt"] */
  titles: z.array(ContentSchema).default([]),
  content: ContentSchema,
  answers: z
    .array(
      z.object({
        content: ContentSchema,
        correctColumn: z.number(),
      })
    )
    .default([]),
});
export type MatrixQuestionSchema = z.infer<typeof MatrixQuestionSchema>;

const QuestionSchema = z.discriminatedUnion("type", [
  BasicQuestionSchema,
  MatrixQuestionSchema,
]);
export type QuestionSchema = z.infer<typeof QuestionSchema>;

const ManifestSchema = z.object({
  $version: z.string().default("1"),
  questions: z.array(QuestionSchema),
});
export type ManifestSchema = z.infer<typeof ManifestSchema>;

export const MANIFEST_FILENAME = "manifest.json";

/** Takes a list of files, reads the manifest from them, and returns the validated manifest file */
export default async function validateManifestFile(manifestFile: File) {
  // check if we can parse it as JSON
  const manifestText = await manifestFile.text();
  let manifestObj;
  try {
    manifestObj = JSON.parse(manifestText);
  } catch (e) {
    throw new Error(`Couldn't parse '${MANIFEST_FILENAME}'. Are you sure it's valid JSON?
${e}`);
  }
  // check if it matches our schema
  try {
    return ManifestSchema.parse(manifestObj);
  } catch (e) {
    throw fromZodError(e);
  }
}
