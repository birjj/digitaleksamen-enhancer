import { MANIFEST_FILENAME, validateManifestFile } from "../schemas";
import { Questionnaire } from "./questionnaire";

/** Takes a list of files and parses them into our model representation, starting with a Questionnaire */
export async function parseManifestFromFiles(
  input: File[]
): Promise<Questionnaire> {
  const manifestFile = input.find((file) => file.name === MANIFEST_FILENAME);
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
  const files: { [k: string]: File } = {};
  input.forEach((file) => {
    const path = file.webkitRelativePath || "";
    if (path.startsWith(pathPrefix)) {
      files[path.substring(pathPrefix.length)] = file;
    } else {
      files[path] = file;
    }
  }, {});

  return new Questionnaire(manifest, files);
}
