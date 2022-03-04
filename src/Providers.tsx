import { BaseProvider, LightTheme } from "baseui";
import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

const engine = new Styletron();

const Providers: React.FC = (props) => {
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>{props.children}</BaseProvider>
    </StyletronProvider>
  );
};

export default Providers;
