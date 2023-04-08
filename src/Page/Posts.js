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
  useGetIdentity,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import {
  Box,
  Container,
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
import ShareIcon from "@mui/icons-material/Share";
import { ShareButton } from "./ShareButton";
const theme = createTheme({
  components: {
    // Name of the component
    RaImageInput: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: "1rem",
        },
      },
    },
  },
});

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
      <DateField source="Created_Date" showDate locales="fr-FR" />
      <DateField source="Last_Modified_Date" locales="fr-FR" />
      <BooleanField source="Is_split" />
      <NumberField source="User_id" />
      <EditButton />
      <ShareButton />
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
  const { data: userInfo, isLoading, err } = useGetIdentity();
  const [num, setNum] = React.useState();
  const min = 1;
  const max = 999;
  const [timeError, setTimeError] = React.useState();
  const [isSetDuration, setIsSetDuration] = React.useState(false);
  const postSave = async function (data) {
    console.log("User info: ", userInfo);
    data["image"] = await toBase64(data["image"].rawFile);
    data = { ...data, User_id: userInfo.id };
    console.log(isSetDuration);
    if (isSetDuration === true) data["duration"] = num;
    else data["duration"] = 0;
    console.log("Duration: ", data["duration"], typeof data["duration"]);
    console.log("Data saved: ", data);
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
    <Container
      xs={{ maxWidth: 1200 }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Create title="Create an exam" sx={{ maxWidth: 500, display: "flex" }}>
        <SimpleForm
          onSubmit={postSave}
          warnWhenUnsavedChanges
          sx={{ display: "flex", maxWidth: 500 }}
        >
          <Box
            sx={{
              width: "auto",
            }}
          >
            <TextInput source="Name" required resettable fullWidth />
            <BooleanInput label="Is split?" source="Is_split" />

            <ImageInput
              source="image"
              label="Choose a profile picture:"
              labelSingle
              accept="image/*"
              required
              placeholder={
                <p>Drop a picture to upload, or click to select one </p>
              }
              sx={{
                "& .RaImageInput-preview": {
                  fontSize: "1.5em !important",
                },
              }}
            >
              <ImageField source="src" title="title" />
            </ImageInput>
            <Container sx={{ display: "flex", padding: "0px !important" }}>
              <BooleanInput
                label="Set duration?"
                source="Is_timer"
                options={{ display: "flex" }}
                onChange={() => {
                  setIsSetDuration(!isSetDuration);
                  console.log(isSetDuration);
                  if (isSetDuration === false) {
                    const note = document.querySelector("#clock");
                    note.classList.remove("Duration");
                  } else {
                    const note = document.querySelector("#clock");
                    note.classList.add("Duration");
                  }
                }}
              />
              <FormControl
                sx={{ width: "25ch", display: "flex" }}
                variant="filled"
                id="clock"
                className="Duration"
              >
                <InputLabel htmlFor="filled-adornment-timer">
                  Test duration
                </InputLabel>
                <FilledInput
                  id="filled-adornment-timer"
                  type="number"
                  endAdornment={
                    <InputAdornment position="end">minutes</InputAdornment>
                  }
                  aria-describedby="filled-weight-helper-text"
                  size="small"
                  onChange={(e) => {
                    var value = parseInt(e.target.value, "10");
                    if (value > max) {
                      // setTimeError(true);
                      value = max;
                    } else if (value < min) {
                      setTimeError(true);
                      value = 0;
                    } else {
                      setTimeError(false);
                    }
                    setNum(value);
                    console.log(e.target.value, typeof value);
                  }}
                  value={num}
                />
                <FormHelperText error={Boolean(timeError)}>
                  {"Time is between 1 and 999"}
                </FormHelperText>
              </FormControl>
            </Container>
            <TextInput
              label="Description"
              source="description"
              resettable
              multiline
              fullWidth
            />
          </Box>
        </SimpleForm>
      </Create>
    </Container>
  );
};
