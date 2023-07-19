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
  `.footer .actions .list:not(.right)`,
  ($elm) => {
    const $otherButtons = Array.from($elm.querySelectorAll(".button"));
    if (
      !$otherButtons.some(($btn) => /Add question/.test($btn.textContent || ""))
    ) {
      return null;
    }

    // for some reason, knockout retains the old HTML when unmounting->remounting the list
    // to avoid inactive buttons being left over, we manually delete any that exist
    const $invalidContainers = Array.from(
      $elm.querySelectorAll(".dee-mass-upload-btn-root")
    );
    $invalidContainers.forEach(($elm) => $elm.parentNode?.removeChild($elm));

    // then insert our own
    const $container = document.createElement("div");
    $container.classList.add("dee-react-root", "dee-mass-upload-btn-root");

    $elm.appendChild($container);
    return $container;
  },
  () => (
    <ChakraProvider>
      <MassUploadBtn />
    </ChakraProvider>
  )
);
