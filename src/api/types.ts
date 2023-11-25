import { type Atom } from "nanostores";
import { type Questionnaire } from "../models/questionnaire";

export type QuestionnaireUploader = (question: Questionnaire) => Promise<void>;
