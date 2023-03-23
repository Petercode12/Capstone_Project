import * as React from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
import { PostList, PostCreate } from "./Page/Posts";
import { PostEdit } from "./Page/PostEdit";
import { authProvider } from "./Page/authProvider";
import { TestPool } from "./Page/TestPool";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import jsonServerProvider from "ra-data-json-server";

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
const dataProvider = jsonServerProvider("http://127.0.0.1:8000", httpClient);
const App = () => (
  <Admin
    dashboard={TestPool}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    {/* <Resource
      name="posts"
      options={{ label: "Test collection" }}
      // list={ListGuesser}
      list={PostList}
      edit={PostEdit}
    /> */}
    {/* <Resource
      name="users"
      options={{ label: "Account manager" }}
      list={UserList}
      icon={PeopleAltIcon}
    /> */}
    <Resource
      name="all_exams"
      options={{ label: "Test collection" }}
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={LibraryAddIcon}
    />
  </Admin>
);

export default App;
