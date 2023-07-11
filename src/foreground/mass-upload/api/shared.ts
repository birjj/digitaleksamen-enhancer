import { uploadImage } from "./images";

/** Calls an API endpoint, appending the relevant headers and failing if the response code isn't successful */
export const callAPI: typeof fetch = async (input, init) => {
  const userGUID: string | undefined = (globalThis as any)?.$?.ajaxSettings
    ?.headers?.["X-UserGuid"];
  console.log("Read user GUID", userGUID, (globalThis as any)?.$);
  const defaultHeaders = {
    "X-UserGuid": userGUID ?? "",
  };

  const resp = await fetch(input, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init?.headers,
    },
  });
  if (resp.ok) {
    return resp;
  } else {
    throw new Error(
      `Got response code '${resp.status}: ${resp.statusText}' from API call`
    );
  }
};

/** Same as `callAPI`, but also checks that the response is JSON before returning */
export async function callJSON<R extends object>(
  ...args: Parameters<typeof callAPI>
): Promise<Partial<R>> {
  const resp = await callAPI(...args);
  let body: Partial<R> | undefined;
  try {
    body = await resp.json();
  } catch (e) {
    throw new Error(`Failed to parse response from ${args[0]}: ${e}`);
  }
  return body || {};
}

export function getCookie(name: string) {
  function escape(s: string) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, "\\$1");
  }
  var match = document.cookie.match(
    RegExp("(?:^|;\\s*)" + escape(name) + "=([^;]*)")
  );
  return match ? match[1] : null;
}

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
  return content.replace(matcher, () => `<img src="${imageUrls.shift()}" />`);
}
