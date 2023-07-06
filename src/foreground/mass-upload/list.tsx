import React from "react";
import { useStore } from "@nanostores/react";
import { MassUploadState } from "./store";
import type Question from "./store/question";
import style from "./list.module.css";
import {
  Badge,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

type MassUploadListProps = {
  state: MassUploadState;
};
const MassUploadList = ({ state }: MassUploadListProps) => {
  const { questions } = state;
  return (
    <List>
      {questions.map((q, i) => {
        return <MassUploadEntry key={i} entry={q} index={i} />;
      })}
    </List>
  );
};
export default MassUploadList;

type MassUploadEntryProps = {
  entry: Question;
  index: number;
};
const MassUploadEntry = ({ entry, index }: MassUploadEntryProps) => {
  const name = useStore(entry.$name);
  const status = useStore(entry.$status);
  const progress = useStore(entry.$progress);
  const error = useStore(entry.$error);
  const isErrored = !!error;
  const isSuccessful = progress >= 1 && !isErrored;

  return (
    <ListItem sx={{ listStyle: "none" }}>
      <div className={style.entry}>
        <CircularProgress
          value={0}
          color="blue.500"
          size="1.25em"
          marginRight="0.5ch"
        />
        <Text>{name || `Question ${index || "unknown"}`}</Text>
        <Badge marginLeft="auto">{status}</Badge>
      </div>
    </ListItem>
  );
};
