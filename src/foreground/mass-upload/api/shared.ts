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
