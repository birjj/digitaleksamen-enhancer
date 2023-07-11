import React, { useCallback, useRef } from "react";
import { Button } from "@chakra-ui/react";

type FileButtonProps = React.PropsWithChildren<{
  onChange: (files: File[]) => void;
  inputProps?: JSX.IntrinsicElements["input"];
  inputRef?: React.Ref<HTMLInputElement>;
}> &
  React.ComponentPropsWithoutRef<typeof Button>;
const FileButton = ({
  onChange,
  inputProps = {},
  inputRef = null,
  ...props
}: FileButtonProps) => {
  const $input = useRef<HTMLInputElement | null>(null);
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

  const combinedInputRef = useCallback(
    ($inp: HTMLInputElement | null) => {
      $input.current = $inp;
      if (inputRef && inputRef instanceof Function) {
        inputRef($inp);
      } else if (inputRef && "current" in inputRef) {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          $inp;
      }
    },
    [$input, inputRef]
  );

  return (
    <>
      <Button {...props} onClick={handleClick} />
      <input
        {...inputProps}
        style={{ display: "none" }}
        ref={combinedInputRef}
        type="file"
        multiple
        webkitdirectory=""
        directory=""
        onChange={handleChange}
      />
    </>
  );
};
export default FileButton;
