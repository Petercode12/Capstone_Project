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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/MyAccount.css";
import axios from "axios";
import userBanner from "../Images/user_banner.png";
import userIcon from "../Images/user_icon.png";
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export const MyAccount = () => {
  const { data: userInfo, isLoading, error1 } = useGetIdentity();
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
      <div class="sm-container">
        <div class="profile-cover">
          <div class="profile-cover-img-wrapper">
            <img
              class="profile-cover-img"
              src={
                userInfo
                  ? userInfo.banner !== ""
                    ? userInfo.banner
                    : userBanner
                  : userBanner
              }
              alt={userInfo ? userInfo.fullName.concat("-cover") : "user-cover"}
            />
          </div>
        </div>
        <div class="mx-md-auto mb-3 text-center">
          <div class="profile-cover-avatar">
            <img
              class="avatar-img"
              src={userInfo ? userInfo.avatar : userIcon}
              alt={userInfo ? userInfo.fullName : "user"}
            />
            <a class="avatar-button text-dark" href="#/my_account/settings/">
              <i class="avatar-icon fa fa-pencil" />
            </a>
          </div>

          <h1
            class="h3 profile-header-title"
            id={
              userInfo
                ? userInfo.fullName.concat("-public-page")
                : "user-public-page"
            }
          >
            {userInfo ? userInfo.fullName : "Guest"}{" "}
          </h1>

          <div class="profile-header-content">
            <p />
          </div>
        </div>
        <ul class="nav nav-tabs mb-4">
          <li class="nav-item">
            <a class="nav-link active" href="#/my_account/tests/">
              Exam results
            </a>
          </li>
        </ul>
      </div>
    </Container>
  );
};
