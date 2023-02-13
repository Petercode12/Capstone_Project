import * as React from "react";
import { Admin, Resource, fetchUtils } from "react-admin";
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

// const httpClient = (url, options = {}) => {
//   if (!options.headers) {
//     options.headers = new Headers({ Accept: "application/json" });
//   }
//   options.headers.set("Access-Control-Allow-Origin", "*");

//   options.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET,POST,PUT,DELETE,OPTIONS"
//   );
//   options.headers.set("Access-Control-Allow-Credentials", "true");
//   options.headers.set("X-Custom-Header", "foobar");
//   options.headers.set("Content-Type", "application/json");
//   options.headers.set("Content-Range", "posts 0-4/27");
//   options.headers.set("Access-Control-Allow-Headers", "*");
//   return fetchUtils.fetchJson(url, options);
// };

// const dataProvider = jsonServerProvider("http://127.0.0.1:8000/src");

// const dataProvider = simpleRestProvider("http://127.0.0.1:8000/src");

const dataProvider = jsonapiClient("http://127.0.0.1:8000/src");

const App = () => (
  <Admin
    dashboard={HomePage}
    dataProvider={dataProvider}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      options={{ label: "Account manager" }}
      list={UserList}
      icon={PeopleAltIcon}
    />
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
