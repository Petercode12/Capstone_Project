import * as React from "react";
import { useState } from "react";
import { useLogin, useNotify } from "react-admin";
import axios from "axios";
import "../Style/MyLoginPage.css";
import { Typography, Container } from "@mui/material";
export function MyLoginPage() {
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
  const handleSubmitSignIn = (e) => {
    e.preventDefault();
    login({ email, password }).catch(() =>
      notify("Invalid email or password", { type: "error" })
    );
  };
  const handleSubmitSignUp = (e) => {
    axios
      .post("http://localhost:8000/save_user/", {
        username,
        password,
        email,
        avatar,
      })
      .then((res) => {
        notify("Sign up successfully!", { type: "success" });
      })
      .catch((err) => {
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
        <div className="container" id="container">
          <div className="form-container sign-up-container">
            <form className="loginFormform" action="#">
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
                type="text"
                placeholder="Name"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="loginForminput"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="loginForminput"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <Typography
                alignLeft
                noWrap
                variant="subtitle2"
                color="red"
                sx={{ textAlign: "left !important" }}
              >
                {error}
              </Typography>
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
              <button className="loginFormbutton" onClick={handleSubmitSignUp}>
                Sign Up
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form className="loginFormform" action="#">
              <h1 className="loginFormh1">Sign in</h1>
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
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
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
