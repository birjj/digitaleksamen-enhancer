import { atom } from "nanostores";

export default function parseFromFiles(files: File[]) {
  const $entries = atom([]);
}

const parseManifest = async (files: File[]) => {
  const manifestFile = files.find((file) => file.name === "config.json");
  if (!manifestFile) {
    throw new Error("Couldn't find 'config.json' in the chosen directory");
  }

  const manifestText = await manifestFile.text();
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (e) {
    throw new Error(`Couldn't parse 'config.json'. Are you sure it's valid JSON?
${e}`);
  }
};
