import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Style/PracticeStyle.css";
import { useGetIdentity } from "react-admin";
import {
  List,
  Datagrid,
  Toolbar,
  Edit,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  NumberField,
  TopToolbar,
} from "react-admin";
const PostEditActions = () => (
  <TopToolbar>
    {/* <ShowButton /> */}
    {/* <ListButton /> */}
  </TopToolbar>
);
export function PracticeList() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [tagName, setTagName] = useState([]);
  const [indexTagName, setIndexTagName] = useState([]);
  const [examTagList, setExamTagList] = useState([]);
  let infinity = "♾️";
  const { data: userInfo, isLoading, error } = useGetIdentity();
  return (
    <List
      actions={<PostEditActions />}
      xs={{ maxWidth: 1280 }}
      sx={{ margin: "0 auto" }}
    >
      <Datagrid bulkActionButtons={false}>
        <NumberField source="id" />
        <TextField source="Name" />
        <DateField source="Created_Date" />
        <DateField source="Last_Modified_Date" />
        <NumberField source="User_id" />
        <EditButton label="PRACTICE" />
      </Datagrid>
    </List>
  );
}
