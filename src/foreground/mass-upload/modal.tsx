import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { Manifest } from "./models/manifest";
import parseFromFiles from "./models";
import MassUploadList from "./list";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Code,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useSteps,
} from "@chakra-ui/react";
import { useStore } from "@nanostores/react";
import FileButton from "../components/file-button";
import { CheckIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { MANIFEST_FILENAME } from "./models/schemas";

type MassUploadModalProps = {
  onClose: () => void;
  opened?: boolean;
};

const MassUploadModal = ({ onClose, opened = false }: MassUploadModalProps) => {
  const [context, setContext] = useState<Manifest | null>(null);
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: 3,
  });
  const [closable, setClosable] = useState(true);

  useEffect(() => {
    setContext(null);
    setActiveStep(0);
    setClosable(true);
  }, [opened, setContext, setActiveStep, setClosable]);

  const steps = [
    <SelectFilesStep
      onGoBack={goToPrevious}
      onGoForwards={goToNext}
      onSetContext={setContext}
      onSetClosable={setClosable}
      onClose={onClose}
      context={context}
    />,
    context ? (
      <UploadFilesStep
        onGoBack={goToPrevious}
        onGoForwards={goToNext}
        onSetContext={setContext}
        onSetClosable={setClosable}
        onClose={onClose}
        context={context}
      />
    ) : null,
    context ? (
      <GreatSuccessStep
        onGoBack={goToPrevious}
        onGoForwards={goToNext}
        onSetContext={setContext}
        onSetClosable={setClosable}
        onClose={onClose}
        context={context}
      />
    ) : null,
  ];

  return (
    <Modal
      isOpen={opened}
      onClose={onClose}
      size="lg"
      closeOnEsc={closable}
      closeOnOverlayClick={closable}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add multiple questions</ModalHeader>
        {closable ? <ModalCloseButton /> : null}
        <ModalBody paddingBottom="1.5em">{steps[activeStep]}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default MassUploadModal;

type StepProps = {
  onGoBack: () => void;
  onGoForwards: () => void;
  onSetContext: (ctx: Manifest) => void;
  onSetClosable: (closable: boolean) => void;
  onClose: () => void;
  context: Manifest | null;
};

type SelectFilesStepProps = StepProps;
const SelectFilesStep = ({
  onSetContext,
  onGoForwards,
}: SelectFilesStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<Error | null>(null);
  const onFilesChanged = useCallback(
    async (files: File[]) => {
      try {
        const parsed = await parseFromFiles(files);
        setError(null);
        onSetContext(parsed);
        onGoForwards();
      } catch (e) {
        console.error(e);
        setError(e);
        if (fileInputRef.current) {
          (fileInputRef.current as any).value = null;
        }
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
        <Link
          color="blue.500"
          href="https://github.com/birjj/digitaleksamen-enhancer/blob/master/docs/file_format.md#mass-upload-file-format"
          target="_blank"
        >
          this document
        </Link>{" "}
        for more information on the required format.
      </Text>
      <ButtonGroup display="flex" margin="1em 0 0" justifyContent="center">
        <FileButton
          onChange={onFilesChanged}
          colorScheme="blue"
          inputRef={fileInputRef}
        >
          Select directory
        </FileButton>
      </ButtonGroup>
      {error ? (
        <Alert status="error" margin="1em 0 0">
          <AlertIcon />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
};

type UploadFilesStepProps = StepProps & { context: Manifest };
const UploadFilesStep = ({
  onGoForwards,
  onGoBack,
  onSetClosable,
  context,
}: UploadFilesStepProps) => {
  const error = useStore(context.$error);
  const progress = useStore(context.$progress);
  const isUploading = useStore(context.$uploading);

  const startUpload = useCallback(async () => {
    await context.upload();
  }, [context]);

  useEffect(() => {
    if (progress >= 1 && !error) {
      onGoForwards();
    }
  }, [onGoForwards, progress, error]);
  useEffect(() => {
    onSetClosable(!isUploading);
  }, [isUploading]);

  return (
    <>
      <Text>
        Validate that the questions look as expected, and then click to start
        uploading:
      </Text>
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
          colorScheme="blue"
          isDisabled={isUploading}
          isLoading={isUploading}
          onClick={startUpload}
        >
          {error ? "Retry" : "Start"} uploading
        </Button>
      </ButtonGroup>
      <Progress
        value={progress * 100}
        isAnimated={!error}
        hasStripe={!error}
        colorScheme={error ? "red" : "green"}
        marginBottom="1em"
        borderRadius="999px"
      />
      {error ? (
        <Alert status="error" marginBottom="1em">
          <AlertIcon />
          <AlertDescription>{String(error)}</AlertDescription>
        </Alert>
      ) : null}
      <MassUploadList state={context} />
    </>
  );
};

type GreatSuccessStepProps = StepProps & { context: Manifest };
const GreatSuccessStep = ({
  onClose,
  onSetClosable,
  context,
}: GreatSuccessStepProps) => {
  useEffect(() => onSetClosable(true), []);
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="200px"
      >
        <Text mt={4} mb={1} fontSize="lg" colorScheme="green">
          Questions uploaded!
        </Text>
        <Text>You can now reload the page to see the changes.</Text>
        <ButtonGroup display="flex" margin="1em 0" justifyContent="center">
          <Button
            colorScheme="blue"
            onClick={() => {
              location.reload();
              onClose();
            }}
          >
            Reload page
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
};
