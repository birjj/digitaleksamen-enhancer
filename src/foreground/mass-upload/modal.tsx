import React, { useState } from "react";
import {
  Anchor,
  Button,
  Code,
  FileButton,
  Group,
  Modal,
  Text,
} from "@mantine/core";

type MassUploadModalProps = {
  onClose: () => void;
  opened?: boolean;
};

const MassUploadModal = ({ onClose, opened = false }: MassUploadModalProps) => {
  const [parsed, setParsed] = useState(null);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title="Add multiple questions"
      size="lg"
    >
      <Text>
        To get started, select a directory containing a <Code>config.json</Code>{" "}
        file.
        <br />
        See <Anchor target="_blank">[TODO]</Anchor> for more information on the
        required format.
      </Text>
      <Group position="center" sx={{ margin: "1rem 0" }}>
        <FileButton
          inputProps={{ webkitdirectory: "", directory: "" }}
          onChange={console.log}
          multiple
        >
          {(props) => <Button {...props}>Select directory</Button>}
        </FileButton>
        <Button color="green" disabled={!parsed}>
          Start uploading
        </Button>
      </Group>
    </Modal>
  );
};
export default MassUploadModal;
