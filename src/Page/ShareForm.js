import { SimpleForm, useCreate, useNotify } from "react-admin";
import { AutocompleteArrayInput } from "react-admin";
import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
    <div>
      {defaultIdList.map((id_list, i) => {
        return (
          <SimpleForm key={i} onSubmit={postSave} defaultValues={id_list}>
            <span>Share this test with</span>
            <AutocompleteArrayInput
              source="id"
              style={{ width: 500 }}
              label="Email"
              choices={emailList}
            />
          </SimpleForm>
        );
      })}
    </div>
  );
}
