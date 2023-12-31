import { callJSON, getCookie, setCookie } from "../shared";

type UploadedFile = File & { uploadedUrl?: string };

/** Uploads an image to the server, returning the URL it is available at */
export async function uploadImage(file: UploadedFile) {
  if (file.uploadedUrl) {
    return file.uploadedUrl;
  }

  const csrf = getCkCsrfToken();
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

  file.uploadedUrl = body.url;
  return body.url!;
}

function getCkCsrfToken() {
  const existingToken = getCookie("ckCsrfToken");
  if (existingToken) {
    return existingToken;
  }

  // if no csrf token exists, just generate a random one - the CK plugin does the same
  let output = "";
  const data = new Uint8Array(40);
  window.crypto.getRandomValues(data);
  for (let i = 0; i < data.length; ++i) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    let char = alphabet.charAt(data[i] % alphabet.length);
    output += 0.5 < Math.random() ? char.toUpperCase() : char;
  }
  setCookie("ckCsrfToken", output);
  return output;
}
