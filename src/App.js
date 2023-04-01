import * as React from "react";
import { render } from "react-dom";
import {
  Admin,
  CustomRoutes,
  Resource,
  fetchUtils,
  defaultTheme,
} from "react-admin";
import { UserList } from "./Page/Users";
import { PostList, PostCreate } from "./Page/Posts";
import { PostEdit } from "./Page/PostEdit";
import { PracticeList } from "./Page/Practice";
import { PracticeTest } from "./Page/PracticeEachTest";
import { authProvider } from "./Page/authProvider";
import { TestPool } from "./Page/TestPool";
import MyLayout from "./MyLayout";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import jsonServerProvider from "ra-data-json-server";
import { MyLoginPage } from "./Page/MyLoginPage";
import { Route } from "react-router";
import { ShareForm } from "./Page/ShareForm";
// A list of allowed origins that can access our backend API

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("Access-Control-Expose-Headers", "X-Total-Count");
  options.headers.set("accept", "*/*");
  options.headers.set("access-control-request-origin", "*");
  options.headers.set(
    "access-control-request-headers",
    "access-control-request-credentials,access-control-request-methods,access-control-request-origin"
  );
  options.headers.set(
    "access-control-request-methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  options.headers.set("access-control-request-credentials", "true");
  options.headers.set("sec-fetch-mode", "cors");
  options.headers.set("sec-fetch-site", "cross-site");
  options.headers.set("sec-fetch-dest", "empty");
  options.headers.set("cache-control", "no-cache");
  return fetchUtils.fetchJson(url, options);
};
const theme = {
  ...defaultTheme,
  sidebar: {
    width: 174,
    closedWidth: 50,
    bgcolor: "#fff",
    zIndex: "20 !important",
  },
};
const dataProvider = jsonServerProvider("http://127.0.0.1:8000", httpClient);

const App = () => (
  <Admin
    dashboard={TestPool}
    dataProvider={dataProvider}
    loginPage={MyLoginPage}
    authProvider={authProvider}
    theme={theme}
    layout={MyLayout}
  >
    <Resource
      name="all_exams"
      options={{ label: "Test collection" }}
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={LibraryAddIcon}
    ></Resource>

    <Resource
      name="practice_tests"
      options={{ label: "Practice tests" }}
      list={PracticeList}
      edit={PracticeTest}
      icon={ModeEditOutlineTwoToneIcon}
    />
    <CustomRoutes>
      <Route path="/share/:id" element={<ShareForm />} />
    </CustomRoutes>
  </Admin>
);

export default App;
