import React from "react";
import { reactInjection } from "../utils";
import {
  Anchor,
  Button,
  Code,
  FileButton,
  Group,
  Modal,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import MassUploadModal from "./modal";

const MassUploadBtn = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open}>Add multiple questions</Button>
      <MassUploadModal onClose={close} opened={opened} />
    </>
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
