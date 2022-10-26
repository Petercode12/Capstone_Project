import * as React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./Page/Users";
import { PostList, PostCreate, PostIcon } from "./Page/posts";
import { PostEdit } from "./Page/PostEdit";
// import { PostEdit } from "./Page/posts";
import { authProvider } from "./Page/authProvider";
import { HomePage } from "./Page/HomePage";
import { PracticePage } from "./Page/PracticePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
    />
    <Resource
      name="posts"
      options={{ label: "Test collection" }}
      list={PostList}
      edit={PostEdit}
      create={PostCreate}
      icon={PostIcon}
    />
    {/* <Resource name="practice" show={PracticePage} /> */}
  </Admin>
);

export default App;
