import { useStore } from "@nanostores/react";
import React, { useLayoutEffect, useRef } from "react";
import { LogLine, LogType, logStore } from "../../../api/log";
import { Box, Text } from "@chakra-ui/react";

const LogView = () => {
  const lines = useStore(logStore);
  const $pre = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    if (!$pre.current) {
      return;
    }
    $pre.current.scrollTop = $pre.current.scrollHeight;
  }, [lines]);

  return (
    <Box
      ref={$pre}
      as="pre"
      bg="gray.900"
      color="white"
      paddingBlock={1}
      paddingInline={2}
      borderRadius="md"
      fontSize="small"
      width="full"
      blockSize="48"
      overflow="auto"
      fontFamily="mono"
      css={{
        "&": {
          "--scrollbar-background": "inherit",
          "--scrollbar-foreground": "var(--chakra-colors-whiteAlpha-400)",
          "--scrollbar-foreground-hover": "var(--chakra-colors-whiteAlpha-500)",
        },
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "&::-webkit-scrollbar-track, &::-webkit-scrollbar-corner, &::-webkit-scrollbar":
          {
            backgroundColor: "var(--scrollbar-background)",
          },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "var(--scrollbar-foreground)",
          borderRadius: "999px",
          border: "1px solid transparent",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "var(--scrollbar-foreground-hover)",
        },
      }}
    >
      <code>
        {lines.map((line, i) => (
          <Line line={line} key={i} />
        ))}
      </code>
    </Box>
  );
};
export default LogView;

const Line = ({ line }: { line: LogLine }) => {
  type chakraScheme = React.ComponentProps<typeof Text>["colorScheme"];
  type chakraColor = React.ComponentProps<typeof Text>["color"];
  const lookup: {
    [k in LogType]: {
      badgeColor: chakraScheme;
      badgeText: string;
      textColor: chakraColor;
    };
  } = {
    [LogType.info]: {
      badgeColor: "blue",
      badgeText: "i",
      textColor: "whiteAlpha.600",
    },
    [LogType.warn]: {
      badgeColor: "yellow",
      badgeText: "w",
      textColor: "yellow.300",
    },
    [LogType.error]: {
      badgeColor: "red",
      badgeText: "e",
      textColor: "red.500",
    },
    [LogType.success]: {
      badgeColor: "green",
      badgeText: "s",
      textColor: "green.400",
    },
  };

  const { badgeColor, badgeText, textColor } = lookup[line.type];
  return (
    <Text as="span" color={textColor}>
      {line.message}
      {`\n`}
    </Text>
  );
};
