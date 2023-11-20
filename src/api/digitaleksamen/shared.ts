import { uploadImage } from "./images";

/** Calls an API endpoint, appending the relevant headers and failing if the response code isn't successful */
export const callAPI: typeof fetch = async (input, init) => {
  const userGUID = getUserGuid();
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

export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
}

export function getUserGuid() {
  const $scripts = Array.from(
    document.querySelectorAll(`script[type="text/javascript"]`)
  );
  for (let i = 0; i < $scripts.length; ++i) {
    const match = /userMagicToken = '([a-zA-Z0-9\-]+)';/.exec(
      $scripts[i].textContent || ""
    );
    if (match) {
      return match[1];
    }
  }
  throw new Error("Couldn't find user GUID");
}
