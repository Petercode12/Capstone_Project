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
} from "react-admin";
import { Box, Container, Grid } from "@mui/material";
export const PostList = () => (
  <List xs={{ maxWidth: 1280 }} sx={{ margin: "0 auto" }}>
    <Datagrid
      initialState={{
        sorting: {
          sortModel: [{ field: "id", sort: "asc" }],
        },
      }}
    >
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

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const PostCreate = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [create, { error }] = useCreate();
  const postSave = async function (data) {
    data["image"] = await toBase64(data["image"].rawFile);
    create("save_exam/", { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      setTimeout(() => {
        redirect("/all_exams");
      }, 100);
    }
  };
  return (
    <Create title="Create an exam">
      <SimpleForm
        sx={{ maxWidth: 500 }}
        onSubmit={postSave}
        warnWhenUnsavedChanges
      >
        <Box
          sx={{
            width: {
              xs: 200, // theme.breakpoints.up('xs')
              sm: 300, // theme.breakpoints.up('sm')
              md: 400, // theme.breakpoints.up('md')
              lg: 450, // theme.breakpoints.up('lg')
              xl: 450, // theme.breakpoints.up('xl')
            },
          }}
        >
          <TextInput source="Name" />
          {/* <DateInput label="Created Date" source="Created_Date" /> */}
          {/* <DateInput label="Last Modified Date" source="Last_Modified_Date" /> */}
          <BooleanInput label="Is split?" source="Is_split" />
          <NumberInput label="User ID" source="User_id" />
          <span>Thumbnail</span>
          <ImageInput source="image" label=" ">
            <ImageField source="src" title="title" />
          </ImageInput>
          <TextInput label="Description" source="description" />
        </Box>
      </SimpleForm>
    </Create>
  );
};
