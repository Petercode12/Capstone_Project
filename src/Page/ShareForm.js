import {
  SimpleForm,
  useCreate,
  useNotify,
  AutocompleteArrayInput,
  Toolbar,
  SaveButton,
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
  TextField as TextField1,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../Style/ShareForm.css";
const PostCreateToolbar = () => {
  const notify = useNotify();
  let navigate = useNavigate();
  return (
    <Toolbar className="PaperBox-saveButton">
      <SaveButton alwaysEnable />
      <span style={{ flex: 1 }} />
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Cancel
      </Button>
    </Toolbar>
  );
};
export function ShareForm() {
  const [emailList, setEmailList] = useState([]);
  const [defaultIdList, setDefaultIdList] = useState([]);
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
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/query_shared_info_by_examid/".concat(params.id)
      )
      .then((res) => {
        let id_list = [];
        for (let e of res.data) {
          id_list.push(e.Shared_user_id);
        }
        setDefaultIdList([{ id: id_list }]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const postSave = (data) => {
    console.log("Data saved: ", data);
    create("save_shared_info/".concat(params.id), { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
    }
  };
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
      {defaultIdList.map((id_list, i) => {
        return (
          <SimpleForm
            key={i}
            onSubmit={postSave}
            warnWhenUnsavedChanges
            sx={{ display: "flex", maxWidth: 500 }}
            toolbar={<PostCreateToolbar />}
            className="PaperBox-formContent"
            defaultValues={id_list}
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
                  source="id"
                  label="Email"
                  choices={emailList}
                  fullWidth
                  options={{ fullWidth: true }}
                />
              </ReferenceArrayInput>
            </Box>
          </SimpleForm>
        );
      })}
    </Container>
  );
}
