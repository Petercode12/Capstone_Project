import * as React from "react";
import { useState } from "react";
import { useLogin, useNotify, useRedirect } from "react-admin";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../Style/MyLoginPage.css";
import { Typography, Container } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import Button from "@mui/material/Button";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

export function MyLoginPage() {
  const redirect = useRedirect();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const login = useLogin();
  const notify = useNotify();
  const [error, setError] = useState("");
  const UPPERCASE_REGEX = new RegExp(/.*[A-Z]/);
  const LOWERCASE_REGEX = new RegExp(/.*[a-z]/);
  const NUMBER_REGEX = new RegExp(/.*\d/);
  const LENGTH_REGEX = new RegExp(/.{8,}$/);
  const SPECIAL_CHARS_REGEX = new RegExp(
    /.*[-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]/
  );
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });
  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    login({ email, password }).catch(() =>
      notify("Invalid email or password", { type: "error" })
    );
  };
  const onSubmit = (data) => {
    console.log("Data: ", data);
    axios
      .post("http://localhost:8000/save_user/", {
        username: data.Name,
        password: data.Password,
        email: data.Email,
        avatar,
      })
      .then((res) => {
        notify("Sign up successfully!", { type: "success" });
        handleSignIn();
      })
      .catch((err) => {
        notify("Sign up fail! Email has been used", {
          type: "error",
        });
        console.log(err);
      });
  };

  const handleSignUp = () => {
    const signUpButton = document.getElementById("signUp");
    const container = document.getElementById("container");
    if (signUpButton !== null) {
      container.classList.add("right-panel-active");
    }
  };
  const handleSignIn = () => {
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");
    if (signInButton !== null) {
      container.classList.remove("right-panel-active");
    }
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function handleAvatar(e) {
    setAvatar(await toBase64(e.target.files[0]));
  }
  const validatePassword = (password) => {
    let errMsg = "";
    if (!UPPERCASE_REGEX.test(password)) {
      errMsg = "At least one Uppercase!";
    } else if (!LOWERCASE_REGEX.test(password)) {
      errMsg = "At least one Lowercase!";
    } else if (!NUMBER_REGEX.test(password)) {
      errMsg = "At least one digit!";
    } else if (!SPECIAL_CHARS_REGEX.test(password)) {
      errMsg = "At least one Special Characters!";
    } else if (!LENGTH_REGEX.test(password)) {
      errMsg = "At least minumum 8 characters!";
    }
    setError(errMsg);
  };
  return (
    <Container
      xs={{ maxWidth: 1200 }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div className="loginForm">
        <div className="container loginPageContainer" id="container">
          <div
            className="form-container sign-up-container"
            // style={{ overflow: "scroll" }}
          >
            <form
              className="loginFormform"
              onSubmit={handleSubmit(onSubmit)}
              style={{ overflow: "scroll" }}
            >
              <h1 className="loginFormh1">Create Account</h1>
              <div className="social-container">
                <a href="#" className="social loginForma">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social loginForma">
                  <i className="fab fa-google-plus-g" />
                </a>
                <a href="#" className="social loginForma">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
              <span className="loginFormspan">
                or use your email for registration
              </span>
              <input
                className="loginForminput"
                {...register("Name", {
                  required: "This input is required!",
                  maxLength: {
                    value: 15,
                    message: "This input must not exceed 15 characters",
                  },
                })}
                type="text"
                placeholder="Name"
                // onChange={(e) => setUsername(e.target.value)}
              />
              <ErrorMessage
                errors={errors}
                name="Name"
                render={({ messages }) => {
                  console.log("messages", messages);
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                        <Typography
                          variant="subtitle2"
                          className="errorType"
                          key={type}
                        >
                          {message}
                        </Typography>
                      ))
                    : null;
                }}
              />

              <input
                className="loginForminput"
                type="email"
                {...register("Email", {
                  required: "This input is required!",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email format!",
                  },
                  maxLength: {
                    value: 200,
                    message: "This input must not exceed 200 characters",
                  },
                })}
                placeholder="Email"
                // onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorMessage
                errors={errors}
                name="Email"
                render={({ messages }) => {
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                        <Typography
                          variant="subtitle2"
                          className="errorType"
                          key={type}
                        >
                          {message}
                        </Typography>
                      ))
                    : null;
                }}
              />
              <input
                className="loginForminput"
                type="password"
                {...register("Password", {
                  required: "This input is required!",
                  validate: {
                    hasUpperCase: (value) =>
                      UPPERCASE_REGEX.test(value) || "At least one Uppercase!",
                    hasLowerCase: (value) =>
                      LOWERCASE_REGEX.test(value) || "At least one Lowercase!",
                    hasNumbers: (value) =>
                      NUMBER_REGEX.test(value) || "At least one digit!",
                    hasSpecialChar: (value) =>
                      SPECIAL_CHARS_REGEX.test(value) ||
                      "At least one Special Characters!",
                    hasEnoughChar: (value) =>
                      LENGTH_REGEX.test(value) ||
                      "At least minumum 8 characters!",
                  },
                  maxLength: {
                    value: 30,
                    message: "This input must not exceed 30 characters",
                  },
                })}
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <ErrorMessage
                errors={errors}
                name="Password"
                render={({ messages }) => {
                  console.log("Messages: ", messages);
                  return messages
                    ? Object.entries(messages).map(([type, message]) => (
                        <Typography
                          variant="subtitle2"
                          className="errorType"
                          key={type}
                        >
                          {message}
                        </Typography>
                      ))
                    : null;
                }}
              />
              <span style={{ margin: "8px 0px 18px 0px" }}>
                <label
                  htmlFor="avatar"
                  style={{
                    float: "left",
                    marginBottom: "4px",
                    fontSize: "15px",
                  }}
                >
                  Choose a profile picture:
                </label>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/png, image/jpeg"
                  onChange={handleAvatar}
                />
              </span>
              <button
                className="loginFormbutton"
                type="submit"
                // onClick={handleSubmitSignUp}
              >
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form className="loginFormform" action="#">
              <h1
                className="loginFormh1"
                style={{ marginTop: "40px", marginBottom: "20px" }}
              >
                Sign in
              </h1>
              <div className="social-container">
                <a href="#" className="social loginForma">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social loginForma">
                  <i className="fab fa-google-plus-g" />
                </a>
                <a href="#" className="social loginForma">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
              <span className="loginFormspan">or use your account</span>
              <input
                type="email"
                className="loginForminput"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="loginForminput"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href="#" className="loginForma">
                Forgot your password?
              </a>
              <button className="loginFormbutton" onClick={handleSubmitSignIn}>
                Sign In
              </button>
              <script type="module" src="./index.js" />
              <Button
                className="backToHome"
                variant="no-outlined"
                startIcon={<KeyboardBackspaceIcon />}
                size="small"
                onClick={() => {
                  redirect("/");
                }}
              >
                BACK TO HOME
              </Button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay loginPageOverlay">
              <div className="overlay-panel overlay-left">
                <h1 className="loginFormh1">Welcome Back!</h1>
                <p className="loginFormp">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost loginFormbutton"
                  id="signIn"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1 className="loginFormh1">Hello, Friend!</h1>
                <p className="loginFormp">
                  Enter your personal details and start journey with us
                </p>
                <button
                  className="ghost loginFormbutton"
                  id="signUp"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
