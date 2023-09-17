import { fromZodError } from "zod-validation-error";
import { QuestionnaireSchema } from "./questionnaire.schema";

/** The filename used to look up the questionnaire file */
export const MANIFEST_FILENAME = "manifest.json";

/** Takes a file containing a manifest, parses it, and returns the validated questionnaire schema */
export async function validateManifestFile(manifestFile: File) {
  // check if we can parse it as JSON
  const manifestText = await manifestFile.text();
  let manifestObj;
  try {
    manifestObj = JSON.parse(manifestText);
  } catch (e) {
    throw new Error(`Couldn't parse '${manifestFile.name}'. Are you sure it's valid JSON?
    ${e}`);
  }
  // check if it matches our schema
  try {
    return QuestionnaireSchema.parse(manifestObj);
  } catch (e) {
    throw fromZodError(e);
  }
}
