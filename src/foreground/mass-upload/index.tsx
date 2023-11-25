import React, {
  FormEventHandler,
  useCallback,
  useId,
  useRef,
  useState,
} from "react";
import { reactInjection } from "../utils";
import {
  Button,
  ButtonGroup,
  ChakraProvider,
  useDisclosure,
} from "@chakra-ui/react";
import LogoIcon from "../components/logo";
import MassUploadModal from "./modal";
import { QuestionIcon } from "@chakra-ui/icons";
import FileButton from "../components/file-button";
import { logError, logWarn, resetLog } from "../../api/log";
import { uploadQuestionnaire } from "../../api/digitaleksamen";
import { QuestionnaireUploader } from "../../api/types";
import { parseManifestFromFiles } from "../../models";
import { type Questionnaire } from "../../models/questionnaire";

const MassUploadBtn = ({ uploader }: { uploader: QuestionnaireUploader }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });

  const $fileInput = useRef<HTMLInputElement>(null);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(
    null
  );

  /** Starts uploading and opens the modal */
  const onFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) {
        return;
      }

      resetLog();
      onOpen();
      try {
        const parsed = await parseManifestFromFiles(files);
        setQuestionnaire(parsed);
        uploader(parsed);
      } catch (err) {
        logError(`Failed to parse questionnaire:\n${err}`);
      }
    },
    [uploader, onOpen, resetLog]
  );

  /** Resets the file input and closes the modal */
  const doClose = () => {
    onClose();
    if (!$fileInput.current) {
      return;
    }
    $fileInput.current.files = null;
  };

  return (
    <>
      <ButtonGroup
        isAttached
        colorScheme="green"
        borderRadius={0}
        margin="2px 2px 2px 1ch"
        fontWeight={400}
        height="initial"
      >
        <FileButton
          onChange={onFiles}
          inputRef={$fileInput}
          leftIcon={<LogoIcon />}
          borderRadius={0}
          fontWeight={400}
          height="initial"
          boxShadow="13px 0 0 -12px rgba(255,255,255,0.5)"
          zIndex={2}
        >
          Add questionnaire from file
        </FileButton>
        <Button
          as="a"
          href="https://github.com/birjj/digitaleksamen-enhancer/blob/master/docs/file_format.md#mass-upload-file-format"
          target="_blank"
          title="Learn more"
          css={{ color: "var(--chakra-colors-white, #fff) !important" }}
          borderRadius={0}
          fontWeight={400}
          height="initial"
          borderInlineStartStyle="solid"
          borderInlineStartColor={"green.500"}
          borderInlineStartWidth={1}
        >
          <QuestionIcon />
        </Button>
      </ButtonGroup>
      <MassUploadModal
        onClose={doClose}
        opened={isOpen}
        questionnaire={questionnaire}
      />
    </>
  );
};

export const injectMassUploadBtn = reactInjection(
  `.footer .actions .list:not(.right)`,
  ($elm) => {
    const $otherButtons = Array.from($elm.querySelectorAll(".button"));
    if (
      !$otherButtons.some(($btn) =>
        /Create questionnaire/i.test($btn.textContent || "")
      )
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
      <MassUploadBtn uploader={uploadQuestionnaire} />
    </ChakraProvider>
  )
);
