import React from "react";
import { reactInjection } from "../utils";
import MassUploadModal from "./modal";
import { Button, ChakraProvider, useDisclosure } from "@chakra-ui/react";

const MassUploadBtn = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  return (
    <>
      <Button onClick={onOpen}>Add multiple questions</Button>
      <MassUploadModal onClose={onClose} opened={isOpen} />
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
  () => (
    <ChakraProvider>
      <MassUploadBtn />
    </ChakraProvider>
  )
);
