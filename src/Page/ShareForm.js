import { email, SimpleForm, useCreate, useNotify } from "react-admin";
import { AutocompleteArrayInput } from "react-admin";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
    <SimpleForm onSubmit={postSave}>
      <span>Share this test with</span>
      <AutocompleteArrayInput
        source="email"
        style={{ width: 500 }}
        label="Email"
        choices={emailList}
        // defaultValue={[
        //   { id: 1, name: "abc@gmail.com" },
        //   { id: 2, name: "xyz@gmail.com" },
        // ]}
      />
    </SimpleForm>
  );
}
