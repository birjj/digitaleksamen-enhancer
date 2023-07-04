import React, { useState } from "react";
import { reactInjection } from "../utils";
import style from "./index.module.css";

const MassUploadBtn = () => {
  const [isShowing, setIsShowing] = useState(false);
  return (
    <button onClick={() => setIsShowing(true)}>Add multiple questions</button>
  );
};

export const injectMassUploadBtn = reactInjection(
  ".dre-header-band .dre-header-band--large__heading",
  ($elm) => {
    const $container = document.createElement("div");
    $container.classList.add("dee-react-root");

    $elm.appendChild($container);
    return $container;
  },
  () => <MassUploadBtn />
);
