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
  useRecordContext,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import BookIcon from "@mui/icons-material/Book";
export const PostIcon = BookIcon;

export const PostList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <DateField source="published_at" />
      <TextField source="average_note" />
      <TextField source="views" />
      <EditButton />
    </Datagrid>
  </List>
);

const PostTitle = () => {
  const record = useRecordContext();
  return <span>Post {record ? `"${record.title}"` : ""}</span>;
};

export function PostEdit() {
  return (
    <Edit title={<PostTitle />}>
      <SimpleForm>
        <button
          className="btn btn-primary"
          style={{ margin: "10px 5px 10px 30px" }}
          type="button"
        >
          <i className="bi bi-plus"></i> Insert MCQ
        </button>
        <TextInput disabled source="id" />
        <TextInput source="title" />
        <TextInput source="teaser" options={{ multiline: true }} />
        <TextInput multiline source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput source="average_note" />
        <TextInput disabled label="Nb views" source="views" />
        <RichTextInput source="body" />
      </SimpleForm>
    </Edit>
  );
}

export const PostCreate = () => (
  <Create title="Create a Post">
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="teaser" options={{ multiline: true }} />
      <TextInput multiline source="body" />
      <TextInput label="Publication date" source="published_at" />
      <TextInput source="average_note" />
    </SimpleForm>
  </Create>
);