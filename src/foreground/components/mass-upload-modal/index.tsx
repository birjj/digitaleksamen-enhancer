import React from "react";
import {
  Badge,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { type Questionnaire } from "../../../models/questionnaire";
import { useStore } from "@nanostores/react";
import { UploadState } from "../../../models/shared";
import LogView from "../log-view";
import { atom } from "nanostores";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { APIProvider } from "../../../api/types";

type MassUploadModalProps = {
  onClose: () => void;
  opened?: boolean;
  questionnaire: Questionnaire | null;
  api: APIProvider;
};

const $defaultState = atom<UploadState>(UploadState.NONE);
const MassUploadModal = ({
  onClose,
  opened = false,
  questionnaire,
  api,
}: MassUploadModalProps) => {
  const status = useStore(
    questionnaire ? questionnaire.$status : $defaultState
  );
  const isUploading = status === UploadState.UPLOADING;
  const isClosable = !isUploading;

  return (
    <Modal
      isOpen={opened}
      onClose={onClose}
      size="lg"
      closeOnEsc={isClosable}
      closeOnOverlayClick={isClosable}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adding questionnaire from file</ModalHeader>
        {isClosable ? <ModalCloseButton /> : null}
        <ModalBody paddingBottom="1.5em">
          <Flex direction="column" alignItems="center">
            <LogView />
            {questionnaire ? (
              <ContinueButton api={api} questionnaire={questionnaire} />
            ) : null}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default MassUploadModal;

const StatusBadge = ({ status }: { status: UploadState }) => {
  switch (status) {
    case UploadState.NONE:
      return <Badge>Waiting</Badge>;
    case UploadState.UPLOADING:
      return (
        <Badge variant="subtle" colorScheme="blue">
          Uploading
        </Badge>
      );
    case UploadState.SUCCESS:
      return (
        <Badge variant="solid" colorScheme="green">
          Success
        </Badge>
      );
    case UploadState.ERROR:
      return (
        <Badge variant="solid" colorScheme="red">
          Error
        </Badge>
      );
  }
};

const ContinueButton = ({
  questionnaire,
  api,
}: {
  questionnaire: Questionnaire;
  api: APIProvider;
}) => {
  const status = useStore(questionnaire.$status);
  if (status === UploadState.SUCCESS) {
    return (
      <Button
        as="a"
        href={api.getQuestionnaireLink(questionnaire)}
        colorScheme="green"
        marginTop={4}
        width="full"
        rightIcon={<ArrowForwardIcon />}
      >
        View uploaded questionnaire
      </Button>
    );
  }
  return (
    <Button
      isDisabled
      isLoading={status === UploadState.UPLOADING}
      marginTop={4}
      width="full"
    >
      {status === UploadState.UPLOADING ? "Uploading..." : "Awaiting upload..."}
    </Button>
  );
};
