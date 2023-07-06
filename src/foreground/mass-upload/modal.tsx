import React, { useCallback, useId, useRef, useState } from "react";
import { MANIFEST_FILENAME, Manifest } from "./store/manifest";
import parseFromFiles from "./store";
import MassUploadList from "./list";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  ButtonGroup,
  Code,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import FileButton from "../components/file-button";
import { ChevronLeftIcon } from "@chakra-ui/icons";

type MassUploadModalProps = {
  onClose: () => void;
  opened?: boolean;
};

const MassUploadModal = ({ onClose, opened = false }: MassUploadModalProps) => {
  const [context, setContext] = useState<Manifest | null>(null);
  const [step, setStep] = useState(0);
  const numSteps = 3;
  const goForwards = useCallback(() => {
    setStep(Math.min(numSteps - 1, step + 1));
  }, [step, setStep]);
  const goBackwards = useCallback(() => {
    setStep(Math.max(0, step - 1));
  }, [step, setStep]);

  return (
    <Modal isOpen={opened} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add multiple questions</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingBottom="1.5em">
          {
            [
              <SelectFilesStep
                onGoBack={goBackwards}
                onGoForwards={goForwards}
                onSetContext={setContext}
                context={context}
              />,
              context ? (
                <UploadFilesStep
                  onGoBack={goBackwards}
                  onGoForwards={goForwards}
                  onSetContext={setContext}
                  context={context}
                />
              ) : null,
            ][step]
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default MassUploadModal;

type StepProps = {
  onGoBack: () => void;
  onGoForwards: () => void;
  onSetContext: (ctx: Manifest) => void;
  context: Manifest | null;
};

type SelectFilesStepProps = StepProps;
const SelectFilesStep = ({
  onSetContext,
  onGoForwards,
}: SelectFilesStepProps) => {
  const [error, setError] = useState<Error | null>(null);
  const onFilesChanged = useCallback(
    async (files: File[]) => {
      try {
        const parsed = await parseFromFiles(files);
        setError(null);
        onSetContext(parsed);
        onGoForwards();
      } catch (e) {
        setError(e);
      }
    },
    [onSetContext, onGoForwards, setError]
  );

  return (
    <>
      <Text>
        To get started, select a directory containing a{" "}
        <Code>{MANIFEST_FILENAME}</Code> file.
        <br />
        See{" "}
        <Link color="blue.500" target="_blank">
          [TODO]
        </Link>{" "}
        for more information on the required format.
      </Text>
      {error ? (
        <Alert>
          <AlertIcon />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      ) : null}
      <ButtonGroup display="flex" margin="1em 0 0" justifyContent="center">
        <FileButton onChange={onFilesChanged} colorScheme="blue">
          Select directory
        </FileButton>
      </ButtonGroup>
    </>
  );
};

type UploadFilesStepProps = StepProps & { context: Manifest };
const UploadFilesStep = ({
  onGoForwards,
  onGoBack,
  context,
}: UploadFilesStepProps) => {
  const error = useStore(context.$error);
  const progress = useStore(context.$progress);
  const isUploading = useStore(context.$uploading);

  const startUpload = useCallback(() => {
    context.upload();
  }, [context]);

  return (
    <>
      <Text>
        Validate that the questions look as expected, and then click to start
        uploading:
      </Text>
      {error ? (
        <Alert>
          <AlertIcon />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      ) : null}
      <ButtonGroup display="flex" margin="1em 0" justifyContent="center">
        <Button
          colorScheme="gray"
          isDisabled={isUploading}
          onClick={onGoBack}
          leftIcon={<ChevronLeftIcon />}
          variant="outline"
        >
          Go back
        </Button>
        <Button
          colorScheme="green"
          isDisabled={isUploading}
          isLoading={isUploading}
          onClick={startUpload}
        >
          Start uploading
        </Button>
      </ButtonGroup>
      <Divider marginBottom="1em" />
      <MassUploadList state={context} />
    </>
  );
};
