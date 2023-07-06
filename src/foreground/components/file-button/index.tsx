import React, { useCallback, useRef } from "react";
import { Button } from "@chakra-ui/react";

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
export default FileButton;
