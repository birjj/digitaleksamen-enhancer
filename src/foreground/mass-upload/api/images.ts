import { timeoutPromise } from "../../utils";

export async function uploadImage(file: File) {
  await timeoutPromise(1000 + Math.random() * 1000);
  return "URL_GOES_HERE";
}
