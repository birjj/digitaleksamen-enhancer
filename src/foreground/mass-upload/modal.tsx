import React, { useCallback, useId, useRef, useState } from "react";
import { MANIFEST_FILENAME } from "./store/manifest";
import parseFromFiles, { MassUploadState } from "./store";
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

type MassUploadModalProps = {
  onClose: () => void;
  opened?: boolean;
};

const MassUploadModal = ({ onClose, opened = false }: MassUploadModalProps) => {
  const [parsed, setParsed] = useState<MassUploadState | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFilesChanged = useCallback(
    async (files: File[]) => {
      try {
        setParsed(await parseFromFiles(files));
        setError(null);
      } catch (e) {
        setParsed(null);
        setError(e);
      }
    },
    [setParsed, setError]
  );

  return (
    <Modal
      isOpen={opened}
      onClose={onClose}
      size="lg"
      closeOnEsc={!isUploading}
      closeOnOverlayClick={!isUploading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add multiple questions</ModalHeader>
        <ModalCloseButton disabled={isUploading} />
        <ModalBody>
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
          <ButtonGroup display="flex" margin="1em 0" justifyContent="center">
            <FileButton
              onChange={onFilesChanged}
              colorScheme="blue"
              isDisabled={isUploading}
            >
              Select directory
            </FileButton>
            <Button
              colorScheme="green"
              isDisabled={!parsed || isUploading}
              variant={parsed ? "solid" : "outline"}
              onClick={() => setIsUploading(true)}
            >
              Start uploading
            </Button>
          </ButtonGroup>
          {parsed ? (
            <>
              <Divider marginBottom="1em" />
              <MassUploadList state={parsed} />
            </>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default MassUploadModal;

type FileButtonProps = React.PropsWithChildren<{
  onChange: (files: File[]) => void;
  inputProps?: JSX.IntrinsicElements["input"];
}> &
  React.ComponentPropsWithoutRef<typeof Button>;
const FileButton = ({
  onChange,
  inputProps = {},
  ...props
}: FileButtonProps) => {
  const $input = useRef<HTMLInputElement>(null);
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      onChange(Array.from(ev.currentTarget.files ?? []));
    },
    [onChange]
  );
  const handleClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (props.disabled || !$input.current) {
        return;
      }
      $input.current.click();
    },
    [props.disabled, $input]
  );
  return (
    <>
      <Button {...props} onClick={handleClick} />
      <input
        {...inputProps}
        style={{ display: "none" }}
        ref={$input}
        type="file"
        multiple
        webkitdirectory=""
        directory=""
        onChange={handleChange}
      />
    </>
  );
};
