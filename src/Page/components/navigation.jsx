import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import { useRedirect } from "react-admin";

export const Navigation = (props) => {
  const redirect = useRedirect();
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar" /> <span className="icon-bar" />{" "}
            <button className="icon-bar" />{" "}
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            StudyAll
          </a>{" "}
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#features" className="page-scroll">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                About
              </a>
            </li>
            <li>
              <a href="#services" className="page-scroll">
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="page-scroll">
                Gallery
              </a>
            </li>
            <li>
              <a href="#team" className="page-scroll">
                Team
              </a>
            </li>
            <li>
              <a href="#contact" className="page-scroll">
                Contact
              </a>
            </li>
            <Button
              style={{
                float: "right",
                margin: "10px 0px 0",
                fontSize: "1.2rem",
              }}
              variant="no-outlined"
              startIcon={<LoginIcon />}
              size="large"
              onClick={() => {
                redirect("/app/");
              }}
            >
              SIGN IN
            </Button>
          </ul>
        </div>
      </div>
    </nav>
  );
};
