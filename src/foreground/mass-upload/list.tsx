import React from "react";
import { useStore } from "@nanostores/react";
import style from "./list.module.css";
import {
  Badge,
  CircularProgress,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, TimeIcon, WarningIcon } from "@chakra-ui/icons";
import { type Questionnaire } from "../../models/questionnaire";
import { type Question } from "../../models/question";
import { UploadState } from "../../models/shared";

type MassUploadListProps = {
  state: Questionnaire;
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
  const isErrored = status === UploadState.ERROR;
  const isSuccessful = status === UploadState.SUCCESS;
  const isUploading = status === UploadState.UPLOADING;

  return (
    <ListItem sx={{ listStyle: "none" }}>
      <div className={style.entry}>
        {isErrored ? (
          <div
            className={`${style["icon-wrapper"]} ${style["icon-wrapper--error"]}`}
          >
            <WarningIcon
              width="0.75em"
              height="0.75em"
              transform="translateX(1px)"
            />
          </div>
        ) : isSuccessful ? (
          <div
            className={`${style["icon-wrapper"]} ${style["icon-wrapper--success"]}`}
          >
            <CheckIcon width="0.75em" height="0.75em" />
          </div>
        ) : isUploading ? (
          <CircularProgress
            isIndeterminate
            color="blue.500"
            size="1.25em"
            marginRight="0.5ch"
          />
        ) : (
          <div
            className={`${style["icon-wrapper"]} ${style["icon-wrapper--waiting"]}`}
          >
            <TimeIcon width="0.75em" height="0.75em" />
          </div>
        )}
        <Text
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          marginRight="0.5ch"
        >
          {name || `Question ${index || "unknown"}`}
        </Text>
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
