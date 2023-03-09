import * as React from "react";
import {
  List,
  Datagrid,
  Edit,
  Create,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  TextInput,
  DateInput,
  BooleanField,
  NumberField,
  useRecordContext,
  NumberInput,
  BooleanInput,
  useCreate,
} from "react-admin";

export const PostList = () => (
  <List>
    <Datagrid>
      {/* <TextField source="id" />
      <TextField source="title" />
      <DateField source="published_at" />
      <TextField source="average_note" />
      <TextField source="views" /> */}
      <NumberField source="id" />
      <TextField source="Name" />
      <DateField source="Created_Date" />
      <DateField source="Last_Modified_Date" />
      <BooleanField source="Is_split" />
      <NumberField source="User_id" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PostCreate = () => {
  const [create] = useCreate();
  const postSave = (data) => {
    console.log("Data: ", data);
    create("save_exam/", { data });
  };
  return (
    <Create title="Create an exam">
      <SimpleForm onSubmit={postSave}>
        <NumberInput source="id" />
        <TextInput source="Name" />
        <DateInput label="Created Date" source="Created_Date" />
        <DateInput label="Last Modified Date" source="Last_Modified_Date" />
        <BooleanInput label="Is split?" source="Is_split" />
        <NumberInput label="User ID" source="User_id" />
      </SimpleForm>
    </Create>
  );
};
