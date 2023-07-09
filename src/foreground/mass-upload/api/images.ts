import { timeoutPromise } from "../../utils";
import { callAPI, callJSON, getCookie } from "./shared";

/** Uploads an image to the server, returning the URL it is available at */
export async function uploadImage(file: File) {
  const csrf = getCookie("ckCsrfToken");
  if (!csrf) {
    throw new Error(
      "Couldn't find the CSRF token for image uploads in cookies"
    );
  }

  const data = new FormData();
  data.append("upload", file);
  data.append("ckCsrfToken", csrf);

  const body = await callJSON<{
    fileName: string;
    uploaded: 0 | 1;
    url: string;
  }>("/data/image", {
    body: data,
    method: "POST",
    mode: "cors",
    credentials: "include",
  });

  if (!body.uploaded || !body.url) {
    throw new Error(
      `Failed to upload image, got failed response from server: ${JSON.stringify(
        body
      )}`
    );
  }

  return body.url!;
}
