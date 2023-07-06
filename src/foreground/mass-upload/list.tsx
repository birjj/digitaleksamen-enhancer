import React from "react";
import { useStore } from "@nanostores/react";
import type Question from "./store/question";
import style from "./list.module.css";
import {
  Badge,
  CircularProgress,
  CircularProgressLabel,
  IconButton,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import type { Manifest } from "./store/manifest";
import { CheckIcon, WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";

type MassUploadListProps = {
  state: Manifest;
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
        {isErrored ? (
          <div
            className={`${style["icon-wrapper"]} ${style["icon-wrapper--error"]}`}
          >
            <WarningIcon width="0.75em" height="0.75em" />
          </div>
        ) : isSuccessful ? (
          <div
            className={`${style["icon-wrapper"]} ${style["icon-wrapper--success"]}`}
          >
            <CheckIcon width="0.75em" height="0.75em" />
          </div>
        ) : (
          <CircularProgress
            value={progress * 100}
            color="blue.500"
            size="1.25em"
            marginRight="0.5ch"
          />
        )}
        <Text>{name || `Question ${index || "unknown"}`}</Text>
        <Badge
          marginLeft="auto"
          colorScheme={isErrored ? "red" : isSuccessful ? "green" : "gray"}
        >
          {status}
        </Badge>
      </div>
    </ListItem>
  );
};
