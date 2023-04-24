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
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/EditPersonalInfo.css";
import axios from "axios";
import userBanner from "../Images/user_banner.png";
import userIcon from "../Images/user_icon.png";
export const EditPersonalInfo = () => {
  const { data: userInfo, isLoading, error1 } = useGetIdentity();
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const PostEditToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton loading alwaysEnable />
    </Toolbar>
  );
  const postSave = async function(data) {
    console.log("User info: ", userInfo);
    if (data["image"]) data["image"] = await toBase64(data["image"].rawFile);
    else data["image"] = "";
    data = { ...data, User_id: userInfo.id };
    console.log("Data saved: ", data);
    // create("save_exam/", { data });
    // if (error) {
    //   notify("Cannot save!", { type: "error" });
    // } else {
    //   notify("Save successfully!", { type: "success" });
    //   setTimeout(() => {
    //     redirect("/all_exams/".concat(userInfo.id));
    //   }, 100);
    // }
  };
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
        <div class="contentblock">
          <SimpleForm
            onSubmit={postSave}
            warnWhenUnsavedChanges
            fullWidth
            toolbar={<PostEditToolbar />}
            sx={{ display: "flex" }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "600", marginBottom: "0px" }}
            >
              Update Personal Information
            </Typography>
            <ul class="nav nav-tabs mb-4" id="pills-tab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#basics">
                  Basic information
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#change-password">
                  Change password
                </a>
              </li>
            </ul>
            <Typography variant="body" gutterBottom>
              Email: trinhmanhhung03@gmail.com
            </Typography>
            <TextInput
              source="fullName"
              required
              resettable
              fullWidth
              defaultChecked
              defaultValue="Name"
            />
            <ImageInput
              source="personalImage"
              label="Personal Image:"
              // labelSingle
              accept="image/*"
              required
              placeholder={
                <p>Drop a picture to upload, or click to select one </p>
              }
              sx={{
                "& .RaLabeled-label": {
                  fontSize: "1rem",
                },
              }}
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          </SimpleForm>
        </div>
      </div>
    </Container>
  );
};
