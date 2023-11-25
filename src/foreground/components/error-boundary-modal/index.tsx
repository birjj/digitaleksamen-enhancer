import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Portal,
} from "@chakra-ui/react";
import React, { ErrorInfo, ReactNode } from "react";
import LogoIcon from "../logo";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundaryModal extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Portal>
          <Box position="fixed" top={0} left={0} right={0} zIndex={9999}>
            <Alert status="error" variant="solid">
              <AlertIcon />
              <AlertTitle>
                An error occured{" "}
                <LogoIcon
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    marginInlineEnd: "1ch",
                  }}
                />
              </AlertTitle>
              <AlertDescription>Reload the page to try again.</AlertDescription>
              <AlertDescription marginInlineStart="auto">
                See the browser console for more details.
              </AlertDescription>
              <CloseButton
                size="sm"
                marginInlineStart={2}
                onClick={this.reset}
              />
            </Alert>
          </Box>
        </Portal>
      );
    }

    return this.props.children;
  }
}
