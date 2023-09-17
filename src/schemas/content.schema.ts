import { z } from "zod";

/** Represents written content in the exam (i.e. content of a text field). You can use '{{ filename }}' to embed an image file */
export const ContentSchema = z.string();
export type ContentSchema = z.infer<typeof ContentSchema>;
