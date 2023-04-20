import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Style/PostEditStyle.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { ToggleButton } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FunctionsIcon from "@mui/icons-material/Functions";
import Remove from "@mui/icons-material/Remove";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { MathFormulaDialog } from "./MathFormulaDialog";
import {
  DefaultEditorOptions,
  RichTextInput,
  RichTextInputToolbar,
  LevelSelect,
  FormatButtons,
  AlignmentButtons,
  ListButtons,
  LinkButtons,
  QuoteButtons,
  ClearButtons,
  ColorButtons,
  ImageButtons,
  useTiptapEditor,
} from "ra-input-rich-text";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Toolbar,
  Edit,
  useNotify,
  List,
  Datagrid,
  Create,
  SimpleForm,
  DateField,
  EditButton,
  TextInput,
  BooleanField,
  NumberField,
  NumberInput,
  BooleanInput,
  ImageInput,
  ImageField,
  useCreate,
  useRedirect,
  useGetIdentity,
  FormDataConsumer,
  Labeled,
  SaveButton,
  DeleteButton,
} from "react-admin";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import {
  useMediaQuery,
  useTheme,
  Grid,
  Box,
  Container,
  createTheme,
  TextField as TextField1,
  InputAdornment,
  FormControl,
  FilledInput,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { MathJax, MathJaxContext } from "better-react-mathjax";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
export function PostEditInfo({ ...props }) {
  //edit create test
  const [data, setData] = useState([]);
  const [create, { error }] = useCreate();
  const [image, setImage] = useState("");
  const notify = useNotify();
  const params = useParams();
  const redirect = useRedirect();
  const { data: userInfo, isLoading, err } = useGetIdentity();
  const [num, setNum] = useState(1);
  const min = 1;
  const max = 999;
  const [timeError, setTimeError] = useState();
  const [isSetDuration, setIsSetDuration] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8000/all_exams/".concat(params.id))
      .then((res) => {
        setData([res.data]);
        setIsSetDuration(res.data["duration"] > 0);
        if (res.data["duration"] !== 0) setNum(res.data["duration"]);
        setImage(res.data["image"]);
        if (res.data["duration"] > 0) {
          const note = document.querySelector("#clock");
          if (note && note.classList.contains("Duration"))
            note.classList.remove("Duration");
        } else {
          const note = document.querySelector("#clock");
          if (note) note.classList.add("Duration");
        }
        console.log("Data of EditInfo: ", res.data);
        console.log("Setduration: ", res.data["duration"] > 0);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  async function updateTestInfo(save_data) {
    console.log("Data: ", save_data);
    console.log("Data saved: ", save_data);
    await axios // post  lich sử làm bài và kết quả
      .patch("http://localhost:8000/all_exams/".concat(params.id), save_data)
      .then((res) => {
        console.log("Data: ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const postSave = async function(data) {
    console.log("User info: ", userInfo);

    if (data["image"]) data["image"] = await toBase64(data["image"].rawFile);
    else data["image"] = image;

    data = { ...data, User_id: userInfo.id };
    if (isSetDuration === true) data["duration"] = num;
    else data["duration"] = 0;

    updateTestInfo(data);
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      setTimeout(() => {
        // redirect("/all_exams");
      }, 100);
    }
  };
  const PostEditToolbar = (props) => (
    <Toolbar {...props}>
      <SaveButton alwaysEnable />
      {/* <DeleteButton /> */}
    </Toolbar>
  );
  return (
    <Dialog open={props.open} onClose={props.handleCloseDialogEditInfo}>
      <div style={{ padding: 16, fontFamily: "sans-serif" }}>
        <SimpleForm
          onSubmit={postSave}
          warnWhenUnsavedChanges
          toolbar={<PostEditToolbar />}
          sx={{ display: "flex", maxWidth: 500 }}
        >
          {data.map((i) => {
            return (
              <Box
                sx={{
                  width: "auto",
                }}
              >
                <TextInput
                  source="Name"
                  required
                  resettable
                  fullWidth
                  defaultChecked
                  defaultValue={i["Name"]}
                />

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
                    "& .RaLabeled-label": {
                      fontSize: "1rem",
                    },
                  }}
                >
                  <ImageField source="src" title="title" />
                </ImageInput>

                <FormDataConsumer>
                  {({ formData, dispatch, ...rest }) => {
                    if (!formData.image && image !== "") {
                      return (
                        <div className="previews">
                          <div className="RaFileInput-removeButton">
                            <Button
                              className="RaFileInput-removeButton"
                              sizeSmall
                              textSizeSmall
                              color="error"
                              aria-label="Delete"
                              title="Delete"
                              tabIndex={0}
                              onClick={() => {
                                // ẩn đi cái hình lun
                                const node = document.querySelector(
                                  ".RaFileInput-removeButton"
                                );
                                node.style.display = "none";
                                console.log("Node: ", node);
                                setImage(""); // xóa ảnh thumbnail trư
                              }}
                            >
                              <svg
                                className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium RaFileInputPreview-removeIcon css-i4bv87-MuiSvgIcon-root"
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                data-testid="RemoveCircleIcon"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
                              </svg>
                            </Button>
                            <img
                              source="image"
                              src={image}
                              alt="thumbnail"
                              className="RaImageField-image"
                            />
                          </div>
                        </div>
                      );
                    }
                  }}
                </FormDataConsumer>
                <Container
                  sx={{
                    display: "flex",
                    padding: "0px !important",
                  }}
                >
                  <BooleanInput
                    label="Set duration?"
                    source="Is_timer"
                    options={{ display: "flex" }}
                    defaultValue={i["duration"] > 0}
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
                      required
                      endAdornment={
                        <InputAdornment position="end">minutes</InputAdornment>
                      }
                      aria-describedby="filled-weight-helper-text"
                      size="small"
                      onChange={(e) => {
                        var value = parseInt(e.target.value, "10");
                        console.log(value, e.target.value.length);
                        if (value > max) {
                          value = max;
                        } else if (value < min) {
                          value = min;
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
                  defaultChecked
                  defaultValue={i["description"]}
                  helperText={false}
                />
              </Box>
            );
          })}
        </SimpleForm>
      </div>
      {/* <DialogActions>
        <Button
          onClick={() => {
            props.handleCloseDialogEditInfo(null);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            props.handleCloseDialogEditInfo(equation);
          }}
        >
          Insert
        </Button>
      </DialogActions> */}
    </Dialog>
  );
}
