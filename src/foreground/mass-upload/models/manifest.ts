import { atom } from "nanostores";
import validateManifestFile, {
  MANIFEST_FILENAME,
  ManifestSchema,
} from "./schemas";
import Question from "./question";

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
