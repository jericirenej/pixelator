/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import { ContextProvider } from "./context/Context";
import "./index.scss";

render(
  () => (
    <ContextProvider>
      <App />
    </ContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
