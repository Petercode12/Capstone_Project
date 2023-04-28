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
  AutocompleteArrayInput,
  Toolbar,
  SaveButton,
  required,
  FormDataConsumer,
  PasswordInput,
} from "react-admin";
import {
  Box,
  Container,
  Grid,
  createTheme,
  TextField as TextField1,
  InputAdornment,
  FormControl,
  FilledInput,
  InputLabel,
  FormHelperText,
  Typography,
  Button,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/EditPersonalInfo.css";
import axios from "axios";
import userBanner from "../Images/user_banner.png";
import userIcon from "../Images/user_icon.png";

export const EditPersonalInfo = () => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );
  const [image, setImage] = useState("");
  const [imageBanner, setImageBanner] = useState("");
  const [mode, setMode] = useState(0);
  const [create, { error }] = useCreate();
  const notify = useNotify();
  let navigate = useNavigate();
  useEffect(() => {
    console.log("User info: ", userInfo);
    if (userInfo) {
      setImage(userInfo.Avatar);
      setImageBanner(userInfo.Banner);
    }
  }, []);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const PostEditToolbar = (props) => (
    <Toolbar {...props} sx={{}}>
      <SaveButton alwaysEnable />
      <span style={{ flex: 1 }} />
      <Button
        variant="outlined"
        onClick={() => {
          navigate(-1);
        }}
      >
        Cancel
      </Button>
    </Toolbar>
  );
  const PasswordValidate = (values) => {
    const errors = {};
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/; ///(?=.*?[#_?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;
    console.log("Mode: ", mode);
    if (mode === 1) {
      console.log("Password: ", userInfo.Password);
      if (!values.password) {
        errors.password = "Required";
      } else {
        if (values.password !== userInfo.Password)
          errors.password = "Wrong password";
      }
      if (!values.newPassword) {
        errors.newPassword = "Required";
      } else {
        const passwordLength = values.newPassword.trim().length;
        const uppercasePassword = uppercaseRegExp.test(values.newPassword);
        const lowercasePassword = lowercaseRegExp.test(values.newPassword);
        const digitsPassword = digitsRegExp.test(values.newPassword);
        const specialCharPassword = specialCharRegExp.test(values.newPassword);
        const minLengthPassword = minLengthRegExp.test(values.newPassword);
        let errMsg = "";

        if (passwordLength === 0) {
          errMsg = "Required";
        } else if (!uppercasePassword) {
          errMsg = "At least one Uppercase";
        } else if (!lowercasePassword) {
          errMsg = "At least one Lowercase";
        } else if (!digitsPassword) {
          errMsg = "At least one digit";
        } else if (!specialCharPassword) {
          errMsg = "At least one Special Characters";
        } else if (!minLengthPassword) {
          errMsg = "At least minumum 8 characters";
        } else {
          errMsg = "";
        }
        console.log("Error: ", errMsg);
        if (errMsg !== "") errors.newPassword = errMsg;
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Required";
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = "Password mismatched";
      }
    }
    return errors;
  };
  const postSave = async function(data) {
    console.log("Data: ", data);
    let save_data = {
      ...data,
      mode,
      Email: userInfo.Email,
      User_id: userInfo.id,
    };
    if (mode === 0) {
      if (data["image"])
        save_data["image"] = await toBase64(data["image"].rawFile);
      else save_data["image"] = image;
      if (data["imageBanner"])
        save_data["imageBanner"] = await toBase64(data["imageBanner"].rawFile);
      else save_data["imageBanner"] = imageBanner;
      save_data["password"] = userInfo.Password;
      console.log("Data saved: ", save_data);
    } else if (mode === 1) {
      console.log("Data saved: ", save_data);
    }
    await axios // post  lich sử làm bài và kết quả
      .patch(
        "http://localhost:8000/auth/",
        // window.location.protocol +
        //   "//" +
        //   window.location.hostname +
        //   ":" +
        //   window.location.port +
        //   "/auth/",
        save_data
      )
      .then((res) => {
        localStorage.setItem("auth", JSON.stringify(res.data));
        if (res.status < 200 || res.status >= 300) {
          return Promise.reject();
        }
        setUserInfo(res.data);
        console.log("Data saved: ", res.data);

        navigate(-1);
        // setTimeout(function() {
        //   window.location.reload();
        // }, 200);
        return Promise.resolve();
      })
      .catch((err) => {
        console.log(err);
      });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      //   setTimeout(() => {
      //     redirect("/all_exams/".concat(userInfo.id));
      //   }, 100);
    }
  };
  return (
    <Container
      xs={{ maxWidth: 768 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "30px",
      }}
    >
      <div className="sm-container">
        <div className="contentblock">
          <SimpleForm
            className="simpleForm"
            onSubmit={postSave}
            // warnWhenUnsavedChanges
            toolbar={<PostEditToolbar />}
            sx={{ display: "flex" }}
            validate={PasswordValidate}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "600", marginBottom: "0px" }}
            >
              Update Personal Information
            </Typography>

            <ul className="nav nav-tabs mb-4" id="pills-tab" role="tablist">
              <li className="nav-item">
                <Button
                  className="nav-link active BasicInformationButton"
                  onClick={() => {
                    console.log("change basic info");
                    let tempInfor = document.querySelector(
                      ".BasicInformationButton"
                    );
                    if (!tempInfor.classList.contains("active"))
                      tempInfor.classList.add("active");
                    document
                      .querySelector(".ChangePasswordButton")
                      .classList.remove("active");
                    document.querySelector(".BasicInformation").style.display =
                      "block";
                    document.querySelector(".ChangePassword").style.display =
                      "none";
                    setMode(0);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Basic information
                </Button>
              </li>
              <li className="nav-item">
                <Button
                  className="nav-link ChangePasswordButton"
                  onClick={() => {
                    console.log("change password button");
                    let tempInfor = document.querySelector(
                      ".ChangePasswordButton"
                    );
                    if (!tempInfor.classList.contains("active"))
                      tempInfor.classList.add("active");
                    document
                      .querySelector(".BasicInformationButton")
                      .classList.remove("active");
                    document.querySelector(".BasicInformation").style.display =
                      "none";
                    document.querySelector(".ChangePassword").style.display =
                      "block";
                    setMode(1);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Change password
                </Button>
              </li>
            </ul>
            <div style={{ width: "100%" }} className="BasicInformation">
              <div>
                <Typography
                  variant="body"
                  gutterBottom
                  sx={{
                    fontWeight: "600",
                    display: "inline-block",
                  }}
                >
                  Email:
                </Typography>{" "}
                <Typography variant="body" sx={{ display: "inline-block" }}>
                  {userInfo.Email} (Email cannot change!)
                </Typography>
              </div>
              <TextInput
                source="fullName"
                required
                resettable
                fullWidth
                defaultChecked
                defaultValue={userInfo.Username}
              />
              <ImageInput
                source="image"
                label="Avatar:"
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
                              setImage(""); // xóa ảnh avatar
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
              <ImageInput
                source="imageBanner"
                label="Banner Image:"
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
                  console.log("Image banner: ", imageBanner);
                  if (!formData.imageBanner && imageBanner !== "") {
                    return (
                      <div className="previews">
                        <div className="RaFileInput-removeButton">
                          <Button
                            className="RaFileInput-removeButton1"
                            color="error"
                            aria-label="Delete banner"
                            title="Delete"
                            tabIndex={0}
                            onClick={() => {
                              // ẩn đi cái hình lun
                              const node = document.querySelector(
                                ".RaFileInput-removeButton1"
                              );
                              node.style.display = "none";
                              console.log("Node: ", node);
                              setImageBanner(""); // xóa ảnh banner
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
                            src={imageBanner}
                            alt="thumbnail"
                            className="RaImageField-image"
                          />
                        </div>
                      </div>
                    );
                  }
                }}
              </FormDataConsumer>
            </div>
            <div style={{ width: "100%" }} className="ChangePassword">
              <PasswordInput
                label="Old password"
                source="password"
                fullWidth={true}
                validate={required()}
                inputProps={{ autoComplete: "off" }}
              />
              <PasswordInput
                label="New password"
                source="newPassword"
                fullWidth={true}
                validate={required()}
                inputProps={{ autoComplete: "new-password" }}
              />
              <PasswordInput
                label="Confirm new password"
                source="confirmPassword"
                fullWidth={true}
                validate={required()}
                inputProps={{ autoComplete: "new-password" }}
              />
            </div>
          </SimpleForm>
        </div>
      </div>
    </Container>
  );
};
