import * as React from "react";
import { render } from "react-dom";
import { Admin, Resource, fetchUtils, ListGuesser } from "react-admin";
import { UserList } from "./Page/Users";
import { PostList, PostCreate } from "./Page/Posts";
import { PostEdit } from "./Page/PostEdit";
import { authProvider } from "./Page/authProvider";
import { HomePage } from "./Page/HomePage";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import jsonServerProvider from "ra-data-json-server";
import simpleRestProvider from "ra-data-simple-rest";
import axios from "axios";
import jsonapiClient from "ra-jsonapi-client";

// A list of allowed origins that can access our backend API

// axios({
//   method: 'get',
//   url: 'http://127.0.0.1:8000/src/all_exams',
//   crossDomain: true,
//   mode: 'CORS'
// })
//   .then(Response => console.log("Axios", Response.data))
const httpClient = (url, options = {}) => {
  // options.mode = 'no-cors'; /* <----- ADDING THIS LINE CAUSES THE PROBLEM */
  // options.setHeader('Access-Control-Allow-Origin', "*");
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  options.headers.set("Access-Control-Expose-Headers", "X-Total-Count");
  // options.headers.set('X-Total-Count', '10');
  options.headers.set("accept", "*/*");
  options.headers.set("access-control-request-origin", "*");
  options.headers.set(
    "access-control-request-headers",
    "access-control-request-credentials,access-control-request-methods,access-control-request-origin"
  );
  // options.headers.set("Access-Control-Request-Headers", "Access-Control-Expose-Headers,Access-Control-Request-Credentials,Access-Control-Request-Methods,Access-Control-Request-Origin");
  options.headers.set(
    "access-control-request-methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  options.headers.set("access-control-request-credentials", "true");
  options.headers.set("sec-fetch-mode", "cors");
  options.headers.set("sec-fetch-site", "cross-site");
  options.headers.set("sec-fetch-dest", "empty");
  options.headers.set("cache-control", "no-cache");
  // options.headers.set();
  return fetchUtils.fetchJson(url, options);
};
const dataProvider = jsonServerProvider("http://127.0.0.1:8000", httpClient);
// const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com', httpClient);

const App = () => (
  <Admin
    dashboard={HomePage}
    // dataProvider={simpleRestProvider('http://127.0.0.1:8000/src')}
    dataProvider={dataProvider}
    // authProvider={authProvider}
  >
    <Resource
      name="posts"
      options={{ label: "Test collection" }}
      list={ListGuesser}
    />
    {/* <Resource
      name="users"
      options={{ label: "Account manager" }}
      list={UserList}
      icon={PeopleAltIcon}
    /> */}
    {/* <Resource
      name="all_exams"
      options={{ label: "Test collection" }}
      list={PostList}
      // edit={PostEdit}
      // create={PostCreate}
      icon={LibraryAddIcon}
    /> */}
  </Admin>
);

export default App;
