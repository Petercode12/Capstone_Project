import * as React from "react";
import { render } from "react-dom";
import {
  Admin,
  CustomRoutes,
  Resource,
  fetchUtils,
  defaultTheme,
  useGetIdentity,
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
import { PracticeResult } from "./Page/PracticeResult";
import { PraceticeResultSpecific } from "./Page/PracticeResultSpecific";
import { MyCustomList } from "./Page/Posts";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
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
const queryClient = new QueryClient();
function App() {
  // const { data, isLoading, error } = useGetIdentity();
  // console.log("data: ", data);
  // let create_test_name = "all_exams";
  // if (userInfo.id) {
  //   create_test_name = "all_exams".concat(userInfo.id);
  // }
  const data = JSON.parse(localStorage.getItem("auth"));
  const userInfo = {
    id: data.id,
    fullName: data.Username,
    avatar: data.Avatar,
  };
  return (
    <QueryClientProvider client={queryClient}>
      <Admin
        dashboard={TestPool}
        dataProvider={dataProvider}
        loginPage={MyLoginPage}
        authProvider={authProvider}
        theme={theme}
        layout={MyLayout}
      >
        {() => {
          console.log("all_exams/".concat(userInfo.id));
        }}
        <Resource
          name={"all_exams/".concat(userInfo.id)}
          options={{ label: "Create test" }}
          list={PostList}
          edit={PostEdit}
          create={PostCreate}
          icon={LibraryAddIcon}
        />

        <Resource
          name="practice_tests"
          options={{ label: "Practice test" }}
          list={PracticeList}
          edit={PracticeTest}
          icon={ModeEditOutlineTwoToneIcon}
        />
        <CustomRoutes>
          {/* <Route path="/all_exams/:id" element={<PostList />} /> */}
          <Route path="/all_exams/share/:id" element={<ShareForm />} />
          <Route
            path="/practice_tests/result/:id"
            element={<PracticeResult />}
          />
          <Route
            path="/practice_tests/result_specific/"
            element={<PraceticeResultSpecific />}
          />
        </CustomRoutes>
      </Admin>
    </QueryClientProvider>
  );
}
export default App;
