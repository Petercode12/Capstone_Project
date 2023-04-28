import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import configureStore from "./Page/store/configureStore";
// import HighlightApp from "./Page/containers/HighlightApp";
import HighlightApp from "./Page/containers/HighlightApp1";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import "./Page/styles/styles.scss";
const store = configureStore();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <HighlightApp />
      </MuiThemeProvider>
    </Provider> */}
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
