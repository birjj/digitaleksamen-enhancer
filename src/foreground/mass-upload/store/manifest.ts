import { atom } from "nanostores";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import Question from "./question";

/** Represents written content in the exam (i.e. content of a text field). You can use '{{ filename }}' to embed an image file */
const ContentSchema = z.object({
  value: z.string(),
});
export type ContentSchema = z.infer<typeof ContentSchema>;
/** Represents an answer - identical to Content, but with the added ability to set whether the answer should be marked as correct */
const AnswerSchema = ContentSchema.extend({
  correct: z.boolean(),
});
export type AnswerSchema = z.infer<typeof AnswerSchema>;

/** Represents a basic question, containing only content and multiple answers */
const BasicQuestionSchema = z.object({
  type: z.literal("basic"),
  content: ContentSchema,
  answers: z.array(AnswerSchema).default([]),
});
export type BasicQuestionSchema = z.infer<typeof BasicQuestionSchema>;
/** Represents a matrix question, containing content and rows of questions, each consisting of a number of questions, one of which can be correct */
const MatrixQuestionSchema = z.object({
  type: z.literal("matrix"),
  /** the title of each column, e.g. ["Sandt", "Falskt"] */
  titles: z.array(z.string()).default([]),
  content: ContentSchema,
  /** each entry is a row, each entry in a row is an Answer */
  answers: z.array(z.array(AnswerSchema)).default([]),
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
async function validateManifestFile(manifestFile: File) {
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

export default async function parseManifestFromFiles(files: File[]) {
  const manifestFile = files.find((file) => file.name === MANIFEST_FILENAME);
  if (!manifestFile) {
    console.log("No manifest file, throwing");
    throw new Error(
      `Couldn't find '${MANIFEST_FILENAME}' in the chosen directory`
    );
  }
  const manifest = await validateManifestFile(manifestFile);

  // compute a mapping of relative path => file
  const pathPrefix = (manifestFile.webkitRelativePath || "").substring(
    0,
    (manifestFile.webkitRelativePath || "").indexOf(MANIFEST_FILENAME)
  );
  const pathLookup: { [k: string]: File } = {};
  files.forEach((file) => {
    const path = file.webkitRelativePath || "";
    if (path.startsWith(pathPrefix)) {
      pathLookup[path.substring(pathPrefix.length)] = file;
    } else {
      pathLookup[path] = file;
    }
  }, {});

  return new Manifest(manifest, pathLookup);
}

export class Manifest {
  manifest: ManifestSchema;
  files: { [k: string]: File };
  questions: Question[];

  $uploading = atom(false);
  $progress = atom(0);
  $error = atom<Error | null>(null);

  constructor(manifest: ManifestSchema, files: { [k: string]: File }) {
    this.manifest = manifest;
    this.files = files;
    this.questions = manifest.questions.map(Question.create);
  }

  async upload() {
    try {
      this.$error.set(null);
      this.$uploading.set(true);
      this.$progress.set(0);

      for (let i = 0; i < this.questions.length; ++i) {
        this.$progress.set(i / this.questions.length);
        await this.questions[i].upload(this);
      }
      this.$progress.set(1);
      this.$uploading.set(false);
    } catch (e) {
      this.$error.set(e);
      this.$uploading.set(false);
    }
  }
}
