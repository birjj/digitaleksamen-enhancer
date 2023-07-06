import { WritableAtom, atom } from "nanostores";
import parseManifestFromFiles, { ManifestSchema } from "./manifest";
import Question from "./question";

export type MassUploadState = {
  manifest: ManifestSchema;
  files: { [k: string]: File };
  questions: Question[];
};
export default async function parseFromFiles(
  fileObjs: File[]
): Promise<MassUploadState> {
  const { manifest, files } = await parseManifestFromFiles(fileObjs);

  return {
    manifest,
    files,
    questions: manifest.questions.map(Question.create),
  };
}
