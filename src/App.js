import * as React from "react";
import { Admin, Resource } from "react-admin";
import { UserList } from "./Page/Users";
import { PostList, PostCreate } from "./Page/Posts";
import { PostEdit } from "./Page/PostEdit";
import { authProvider } from "./Page/authProvider";
import { HomePage } from "./Page/HomePage";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

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
      // name="all_exams"
      name="posts"
      options={{ label: "Test collection" }}
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={LibraryAddIcon}
    />
  </Admin>
);

export default App;
