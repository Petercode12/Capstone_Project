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
import { ShareButton } from "./ShareButton";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export function PostList() {
  return (
    <List xs={{ maxWidth: 1280 }} sx={{ margin: "0 auto" }} emptyWhileLoading>
      <Datagrid optimized>
        <NumberField source="id" />
        <TextField source="Name" />
        <DateField source="Created_Date" showDate locales="fr-FR" />
        <DateField source="Last_Modified_Date" locales="fr-FR" />
        <EditButton />
        <ShareButton />
      </Datagrid>
    </List>
  );
}

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
export const PostCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [create, { error }] = useCreate();
  const { data: userInfo, isLoading, err } = useGetIdentity();
  const [num, setNum] = React.useState(1);
  const min = 1;
  const max = 999;
  const [timeError, setTimeError] = React.useState();
  const [isSetDuration, setIsSetDuration] = React.useState(false);
  const postSave = async function(data) {
    console.log("User info: ", userInfo);
    if (data["image"]) data["image"] = await toBase64(data["image"].rawFile);
    else data["image"] = "";
    data = { ...data, User_id: userInfo.id };
    if (isSetDuration === true) data["duration"] = num;
    else data["duration"] = 0;
    console.log("Data saved: ", data);
    create("save_exam/", { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      setTimeout(() => {
        redirect("/app/all_exams/".concat(userInfo.id));
      }, 100);
    }
  };
  return (
    <Container
      xs={{ maxWidth: 1200 }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Create title="Create an exam" sx={{ maxWidth: 500, display: "flex" }}>
        <SimpleForm
          onSubmit={postSave}
          warnWhenUnsavedChanges
          toolbar={<PostEditToolbar />}
          sx={{ display: "flex", maxWidth: 500 }}
        >
          <Box
            sx={{
              width: "auto",
            }}
          >
            <TextInput source="Name" required resettable fullWidth />
            <ImageInput
              source="image"
              label="Choose a profile picture:"
              labelSingle
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
              <ImageField source="src" title="title" required />
            </ImageInput>
            <Container sx={{ display: "flex", padding: "0px !important" }}>
              <BooleanInput
                label="Set duration?"
                source="Is_timer"
                options={{ display: "flex" }}
                onChange={() => {
                  setIsSetDuration(!isSetDuration);
                  if (isSetDuration === false) {
                    const note = document.querySelector("#clock");
                    note.classList.remove("Duration");
                  } else {
                    const note = document.querySelector("#clock");
                    note.classList.add("Duration");
                  }
                }}
              />
              <FormControl
                sx={{ width: "25ch", display: "flex" }}
                variant="filled"
                id="clock"
                className="Duration"
              >
                <InputLabel htmlFor="filled-adornment-timer">
                  Test duration
                </InputLabel>
                <FilledInput
                  id="filled-adornment-timer"
                  type="number"
                  required
                  endAdornment={
                    <InputAdornment position="end">minutes</InputAdornment>
                  }
                  aria-describedby="filled-weight-helper-text"
                  size="small"
                  onChange={(e) => {
                    var value = parseInt(e.target.value, "10");
                    if (value > max) {
                      value = max;
                    } else if (value < min) {
                      value = min;
                    } else {
                      setTimeError(false);
                    }
                    setNum(value);
                  }}
                  value={num}
                />
                <FormHelperText error={Boolean(timeError)}>
                  {"Time is between 1 and 999"}
                </FormHelperText>
              </FormControl>
            </Container>
            <AutocompleteArrayInput
              validate={required()}
              source="tags"
              label="Tag"
              choices={[
                { id: "0", name: "Math" },
                { id: "1", name: "English" },
                { id: "2", name: "Geography" },
                { id: "3", name: "Physics" },
                { id: "4", name: "Calculus" },
                { id: "5", name: "IELTS" },
                { id: "6", name: "Others" },
              ]}
              fullWidth
              options={{ fullWidth: true }}
            />
            <TextInput
              label="Description"
              source="description"
              required
              resettable
              multiline
              fullWidth
              helperText={false}
            />
          </Box>
        </SimpleForm>
      </Create>
    </Container>
  );
};
