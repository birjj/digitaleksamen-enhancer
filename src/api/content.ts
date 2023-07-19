import { uploadImage } from "./images";
import { callAPI } from "./shared";

/** Sets the content of the given content field */
export async function setContent(contentId: string, content: string) {
  if (!contentId) {
    throw new Error(
      "Attempted to set content of question without specifying ID"
    );
  }
  await callAPI(`/data/content/${contentId}`, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(content),
    method: "PUT",
    mode: "cors",
    credentials: "include",
  });
  return true;
}

/** Sets the content of the given content field, uploading any images found first */
export async function setContentWithImages(
  contentId: string,
  content: string,
  fileLookup: { [k: string]: File }
) {
  const imageUrlPromises: Promise<string>[] = [];
  const matcher = /\{\{([^\}]+)\}\}/g;
  // create our imageUrlPromises array from each `{{ filename }}` entry in the content
  content.replace(matcher, (fullMatch, match) => {
    match = match.trim();
    if (!fileLookup[match]) {
      imageUrlPromises.push(Promise.resolve(fullMatch));
    } else {
      imageUrlPromises.push(uploadImage(fileLookup[match]));
    }
    return fullMatch;
  });
  // then wait for them all to upload
  const imageUrls = await Promise.all(imageUrlPromises);
  // then put them into the HTML
  const finalContent = content.replace(
    matcher,
    () => `<img src="${imageUrls.shift()}" />`
  );

  return await setContent(contentId, finalContent);
}
