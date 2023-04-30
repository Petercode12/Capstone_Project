import * as React from "react";
import {
  List,
  Datagrid,
  Create,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  TextInput,
  BooleanField,
  NumberField,
  NumberInput,
  BooleanInput,
  ImageInput,
  ImageField,
  useCreate,
  useNotify,
  useRedirect,
  useGetIdentity,
  ReferenceInput,
  SelectInput,
  AutocompleteArrayInput,
  Toolbar,
  SaveButton,
  required,
  ListContextProvider,
  useGetList,
  useList,
} from "react-admin";
import {
  Box,
  Container,
  Grid,
  createTheme,
  TextField as TextField1,
  InputAdornment,
  FormControl,
  FilledInput,
  InputLabel,
  FormHelperText,
  TablePagination,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  TableRow,
  styled,
  tableCellClasses,
  TableSortLabel,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";

import { visuallyHidden } from "@mui/utils";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/MyAccount.css";
import axios from "axios";
import userBanner from "../Images/user_banner.png";
import userIcon from "../Images/user_icon5.png";
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function convertQueryDataToQuestionList(data) {
  let questionList = [];

  for (let e of data) {
    let start = e.Start_time;
    let end = e.End_time;
    let diff = start
      .split(":")
      .map((item, index) =>
        Math.max((end.split(":")[index] - item).toFixed(0), 0)
      )
      .join(":");
    let time_diff = start
      .split(":")
      .map((item, index) =>
        Math.max((end.split(":")[index] - item).toFixed(0), 0)
      );
    let time_diff_sec =
      time_diff[0] * 60 * 60 + time_diff[1] * 60 + time_diff[2];
    let k = {
      id: e.id,
      name: e.Name,
      score: e.Score,
      date: e.Date, //new Date(Date.parse("2012-01-26T13:51:50.417-07:00")),
      time: time_diff_sec,
      diff: diff,
      viewresult: "View",
    };
    questionList.push(k);
  }
  // console.log("Question List: ", questionList);
  return questionList;
}
const VISIBLE_FIELDS = ["name", "rating", "country", "dateCreated", "isAdmin"];

export const MyAccountTestCreated = () => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );
  const [questionList, setQuestionList] = useState([]);
  const { data } = useDemoData({
    dataSet: "Employee",
    visibleFields: VISIBLE_FIELDS,
    rowLength: 100,
  });
  useEffect(() => {
    axios
      .get("http://localhost:8000/my_account/tests/".concat(userInfo.id))
      .then((res) => {
        setQuestionList(convertQueryDataToQuestionList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userInfo]);
  console.log("Data: ", data);
  return (
    <Container
      xs={{ maxWidth: 768 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "30px",
      }}
    >
      <div className="sm-container">
        <div className="profile-cover">
          <div className="profile-cover-img-wrapper">
            <img
              className="profile-cover-img"
              src={
                userInfo
                  ? userInfo.Banner !== ""
                    ? userInfo.Banner
                    : userBanner
                  : userBanner
              }
              alt={userInfo ? userInfo.fullName + "-cover" : "user-cover"}
            />
          </div>
        </div>
        <div className="mx-md-auto mb-3 text-center">
          <div className="profile-cover-avatar">
            <img
              className="avatar-img"
              src={
                userInfo
                  ? userInfo.Avatar !== ""
                    ? userInfo.Avatar
                    : userIcon
                  : userIcon
              }
              alt={userInfo ? userInfo.Username : "user"}
            />
            <a
              className="avatar-button text-dark"
              href="#/my_account/settings/"
            >
              <i className="avatar-icon fa fa-pencil" />
            </a>
          </div>

          <h1
            className="h3 profile-header-title"
            id={
              userInfo
                ? userInfo.Username + "-public-page"
                : "user-public-page"
            }
          >
            {userInfo ? userInfo.Username : "Guest"}{" "}
          </h1>

          <div className="profile-header-content">
            <p />
          </div>
        </div>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <a className="nav-link " href="#/my_account/tests/">
              Exam results
            </a>
            <a className="nav-link active" href="#/my_account/tests/created/">
              Exam created management
            </a>
          </li>
        </ul>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              pagination
              {...data}
              slots={{
                toolbar: GridToolbar,
              }}
              initialState={{
                ...data.initialState,
                filter: {
                  ...data.initialState?.filter,
                  filterModel: {
                    items: [
                      {
                        field: "rating",
                        operator: ">",
                        value: "0",
                      },
                    ],
                  },
                },
                pagination: { paginationModel: { pageSize: 25 } },
              }}
            />
          </div>
        </Paper>
      </div>
    </Container>
  );
};
