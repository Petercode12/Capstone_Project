import {
  email,
  SimpleForm,
  useCreate,
  useNotify,
  AutocompleteArrayInput,
  Create,
  List,
  Datagrid,
  DateField,
  TextField,
  EditButton,
  TextInput,
  BooleanInput,
  ImageInput,
  ImageField,
  Toolbar,
  SaveButton,
  ReferenceInput,
  ReferenceArrayInput,
} from "react-admin";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  Grid,
  createTheme,
  TextField as TextField1,
  InputAdornment,
  FormControl,
  OutlinedInput,
  FilledInput,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import "../Style/ShareForm.css";
const PostCreateToolbar = () => {
  const notify = useNotify();
  return (
    <Toolbar className="PaperBox-saveButton">
      <SaveButton label="Save" />
    </Toolbar>
  );
};
export function ShareForm() {
  const [emailList, setEmailList] = useState([]);
  const [create, { error }] = useCreate();
  const notify = useNotify();
  const params = useParams();
  useEffect(() => {
    axios
      .get("http://localhost:8000/all_users")
      .then((res) => {
        let temp_emailList = [];
        for (let e of res.data) {
          temp_emailList.push({ id: e.id, name: e.Email });
        }
        setEmailList(temp_emailList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const postSave = (data) => {
    create("save_shared_info/".concat(params.id), { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
    }
  };
  console.log("Email list: ", emailList);
  return (
    <Container
      xs={{ maxWidth: 600 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "24px",
      }}
    >
      <SimpleForm
        onSubmit={postSave}
        warnWhenUnsavedChanges
        sx={{ display: "flex", maxWidth: 500 }}
        toolbar={<PostCreateToolbar />}
        className="PaperBox-formContent"
      >
        <Box
          sx={{
            minWidth: 450,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Share this test with:
          </Typography>
          <ReferenceArrayInput
            fullWidth
            filterToQuery={(searchText) => ({ search: searchText })}
            allowEmpty
          >
            <AutocompleteArrayInput
              source="email"
              label="Email"
              choices={emailList}
              fullWidth
              options={{ fullWidth: true }}
            />
          </ReferenceArrayInput>
        </Box>
      </SimpleForm>
    </Container>
  );
}
