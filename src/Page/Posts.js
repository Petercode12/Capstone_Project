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
  useNotify,
  useRefresh,
  useRedirect,
} from "react-admin";

export const PostList = () => (
  <List>
    <Datagrid>
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
  const notify = useNotify();
  const redirect = useRedirect();
  const [create, { error }] = useCreate();
  const postSave = (data) => {
    // console.log("Data: ", data);
    create("save_exam/", { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" })
      setTimeout(() => {
        redirect('/all_exams');
      }, 100);
      // window.location.reload();

    }
  };
  return (
    <Create title="Create an exam">
      <SimpleForm sx={{ maxWidth: 500 }} onSubmit={postSave} warnWhenUnsavedChanges>
        <TextInput source="Name" />
        {/* <DateInput label="Created Date" source="Created_Date" /> */}
        {/* <DateInput label="Last Modified Date" source="Last_Modified_Date" /> */}
        <BooleanInput label="Is split?" source="Is_split" />
        <NumberInput label="User ID" source="User_id" />
      </SimpleForm>
    </Create>
  );
};
