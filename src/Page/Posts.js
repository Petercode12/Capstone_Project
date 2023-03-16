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
import { Box, } from '@mui/material';
export const PostList = () => (
  <List>
    <Datagrid initialState={{
      sorting: {
        sortModel: [{ field: 'id', sort: 'asc' }],
      },
    }}>
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
          <TextInput source="Name" fullWidth />
          <BooleanInput label="Is split?" source="Is_split" fullWidth />
          <NumberInput label="User ID" source="User_id" fullWidth />
        </Box>
        {/* <DateInput label="Created Date" source="Created_Date" /> */}
        {/* <DateInput label="Last Modified Date" source="Last_Modified_Date" /> */}

      </SimpleForm>
    </Create>
  );
};
