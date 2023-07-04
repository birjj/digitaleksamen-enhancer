/**
 * @fileoverview Handles attaching to various elements as they appear and disappear from the DOM
 * Most of the logic should be handled in individual components
 */

import "./style.module.css";

import InjectionObserver from "./observer";
import { injectMassUploadBtn } from "./mass-upload";

// start observing the DOM
new InjectionObserver([injectMassUploadBtn]);
