import React from "react";
import { reactInjection } from "../utils";
import MassUploadModal from "./modal";
import { Button, ChakraProvider, useDisclosure } from "@chakra-ui/react";
import LogoIcon from "../components/logo";

const MassUploadBtn = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  return (
    <>
      <Button
        colorScheme="green"
        margin="2px 2px 2px 1ch"
        borderRadius="0"
        height="initial"
        fontWeight="400"
        onClick={onOpen}
        leftIcon={<LogoIcon />}
      >
        Add multiple questions
      </Button>
      <MassUploadModal onClose={onClose} opened={isOpen} />
    </>
  );
};

export const injectMassUploadBtn = reactInjection(
  `.footer .actions .list`,
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
