import { useGetIdentity, useRedirect } from "react-admin";
import "../Style/Dashboard.css";
import mathformula2 from "../Images/mathformula2.png";
import Divider from "@mui/material/Divider";
import { Carousel } from "react-carousel-minimal";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Container,
  Grid,
} from "@mui/material";
import { useNotify } from "react-admin";
import emailjs from "emailjs-com";
import Button from "@mui/material/Button";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import "../Style/HomePage.css";
const initialState = {
  name: "",
  email: "",
  message: "",
};
export const Dashboard = () => {
  const { data: userInfo, isLoading, err } = useGetIdentity();
  const [examList, setExamList] = useState([]);
  const redirect = useRedirect();
  let infinity = "♾️";
  const [landingPageData, setLandingPageData] = useState({});
  const [{ name, email, message }, setState] = useState(initialState);
  const notify = useNotify();
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/recent_practice_exams/".concat(
          userInfo !== undefined ? userInfo["id"] : 0
        )
      )
      .then((res) => {
        setExamList(res.data);
        console.log("Exam list: ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userInfo]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  const clearState = () => setState({ ...initialState });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);

    emailjs
      .sendForm(
        "service_32fsbp5",
        "template_ml3ygdg",
        e.target,
        "zgEUaSGmakp-N6JaL"
      )
      .then(
        (result) => {
          console.log(result.text);
          notify("Send successfully!", { type: "success" });
          clearState();
        },
        (error) => {
          notify("Cannot save!", { type: "error" });
          console.log(error.text);
        }
      );
  };
  const data2 = [
    {
      image: "/img/CreateTestMode/CreateTest.png",
      caption: "Create Test",
    },
    {
      image: "/img/CreateTestMode/ShareTest.png",
      caption: "Share test",
    },
    {
      image: "/img/CreateTestMode/CreateTestIELTSWriting1.png",
      caption: "Create IELTS Writing",
    },
    {
      image: "/img/CreateTestMode/CreateTestMath1.png",
      caption: "Create Math Exam",
    },
    {
      image: "/img/PracticeTestMode/TestPool/PracticePage1.png",
      caption: "Test Pool",
    },
    {
      image: "/img/PracticeTestMode/DoTest/PracticeMath.png",
      caption: "Practice Math",
    },
    {
      image: "/img/PracticeTestMode/TestResult/TestResultMath.png",
      caption: "Math Test Result",
    },
    {
      image:
        "/img/PracticeTestMode/TestResultSpecific/TestResultSpecificMath.png",
      caption: "Math Test Result Specific",
    },
  ];

  const captionStyle = {
    fontSize: "2em",
    fontWeight: "bold",
    color: "white",
  };
  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  return (
    <>
      <div className="dashBoardElements">
        <div
          style={{
            marginLeft: "4rem",
            marginRight: "4rem",
            marginTop: "2rem",
            marginBottom: "2rem",
            color: "#35509a",
          }}
        >
          <h1>
            Hello, have a nice experience{" "}
            <span style={{ color: "#0492c2" }}>
              {userInfo !== undefined ? userInfo.fullName : ""}
            </span>
            !
          </h1>
          <h2>Your recent practice test</h2>
          <div spacing={2} className="GridContainer">
            {examList
              ? examList.map((exam, i) => {
                  if (exam["description"] === "") {
                    exam["description"] = "No description";
                  }
                  if (exam["duration"] === 0) {
                    exam["duration"] = infinity;
                  }
                  return (
                    <div item="true" key={i} className="GridPaper">
                      <Card
                        sx={{
                          width: 340,
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                        className="NavigationAsidePaper"
                      >
                        <CardMedia
                          component="img"
                          alt="exam paper"
                          height="140"
                          image={exam["image"]}
                        />
                        <CardContent sx={{ padding: "0px 12px" }}>
                          <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            noWrap
                            sx={{ margin: "4px 0px" }}
                          >
                            {exam["Name"]}
                          </Typography>
                          <Typography
                            variant="body1"
                            inline="true"
                            color="text.secondary"
                            noWrap
                            sx={{
                              marginBottom: "2px",
                              marginLeft: "2px",
                            }}
                          >
                            {exam["description"]}
                          </Typography>
                          <Typography variant="subtitle1" component="div">
                            <div
                              style={{
                                transform: "translateY(1px)",
                                display: "inline-block",
                              }}
                            >
                              <i
                                className="fa-regular fa-clock"
                                style={{
                                  fontSize: "20px",
                                  marginRight: ".4rem",
                                  marginTop: ".4rem",
                                }}
                                sx={{ margin: "0px 4px" }}
                              />
                            </div>
                            {exam["duration"]} min
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() => {
                              redirect(
                                window.location.protocol +
                                  "//" +
                                  window.location.hostname +
                                  ":" +
                                  window.location.port +
                                  "/app/practice_tests/" +
                                  exam["id"]
                              );
                            }}
                          >
                            Practice again
                          </Button>
                        </CardActions>
                      </Card>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
      </div>
      <Divider variant="middle" />
      <div className="dashBoardElements">
        <div
          style={{
            marginLeft: "4rem",
            marginRight: "4rem",
            marginTop: "2rem",
            marginBottom: "2rem",
            color: "#35509a",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2>Some instructions before using</h2>
          </div>
          <div className="rowDashboard">
            <div className="columnDashboard">
              <div
                className="font-architects-daughter text-xl text-purple-600 mb-2"
                style={{ marginLeft: "30%" }}
              >
                Math insertion feature
              </div>
              <h3 style={{ marginLeft: "30%" }}>AsciiMath</h3>
              <div style={{ marginLeft: "30%" }}>
                For math insertion feature, we used AsciiMath which is an
                easy-to-write markup language for mathematics.
              </div>
              <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
              />
              <ul className="ulDashboard" style={{ marginLeft: "30%" }}>
                <li className="liDashboard">
                  Check AsciiMath here:{" "}
                  <a href="http://asciimath.org/" style={{ color: "#5d5dff" }}>
                    AsciiMath
                  </a>
                </li>

                <li className="liDashboard">
                  Take a look at Preview before inserting to have correct
                  formulas!
                </li>
              </ul>
            </div>
            <div className="columnDashboard">
              <img
                src={mathformula2}
                style={{ marginLeft: "10%" }}
                alt="MathFormula"
              />
            </div>
          </div>
        </div>
      </div>

      <Carousel
        data={data2}
        time={2000}
        width="750px"
        height="500px"
        captionStyle={captionStyle}
        radius="10px"
        slideNumber={true}
        slideNumberStyle={slideNumberStyle}
        captionPosition="bottom"
        automatic={false}
        dots={true}
        pauseIconColor="white"
        pauseIconSize="40px"
        slideBackgroundColor="darkgrey"
        slideImageFit="cover"
        thumbnails={true}
        thumbnailWidth="100px"
        style={{
          textAlign: "center",
          maxWidth: "850px",
          margin: "40px auto",
        }}
      />

      <Grid
        container
        justifyContent="space-between"
        spacing={2}
        wrap="nowrap"
        id="contact"
        alignItems="center"
        justify="center"
      >
        {/* <div > */}
        <div className="container">
          <Grid container columnSpacing={10}>
            <Grid item xs={12} md={8}>
              <div className="row">
                <div className="section-title">
                  <h2>Get In Touch</h2>
                  <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                    Please fill out the form below to send us an email and we
                    will get back to you as soon as possible.
                  </p>
                </div>
                <form
                  name="sentMessage"
                  validate="true"
                  onSubmit={handleSubmit}
                  style={{ width: "90%" }}
                >
                  <Grid container columnSpacing={2} rowSpacing={0}>
                    <Grid item xs={12} md={6}>
                      <div className="form-group">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="form-control"
                          placeholder="Name"
                          required
                          onChange={handleChange}
                        />
                        <p className="help-block text-danger" />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <div className="form-group">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Email"
                          required
                          onChange={handleChange}
                        />
                        <p className="help-block text-danger" />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="form-group">
                        <textarea
                          name="message"
                          id="message"
                          className="form-control"
                          rows="4"
                          placeholder="Message"
                          required
                          onChange={handleChange}
                        />
                        <p className="help-block text-danger" />
                      </div>
                    </Grid>
                  </Grid>
                  <div id="success" />
                  <button type="submit" className="btn btn-custom btn-lg">
                    Send Message
                  </button>
                </form>
              </div>
            </Grid>
            <Grid item md={4} className="contact-info">
              <div className="contact-item">
                <h3>Contact Info</h3>
                <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  <span>
                    <i className="fa fa-map-marker" /> Address
                  </span>
                  {landingPageData.Contact
                    ? landingPageData.Contact.address
                    : "loading"}
                </p>
              </div>
              <div className="contact-item">
                <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  <span>
                    <i className="fa fa-phone" /> Phone
                  </span>{" "}
                  {landingPageData.Contact
                    ? landingPageData.Contact.phone
                    : "loading"}
                </p>
              </div>
              <div className="contact-item">
                <p style={{ color: "rgba(255, 255, 255, 0.75)" }}>
                  <span>
                    <i className="fa fa-envelope-o" /> Email
                  </span>{" "}
                  <a
                    className="emailLink"
                    href="mailto:phuoc.phamcse206@hcmut.edu.vn"
                  >
                    {landingPageData.Contact
                      ? landingPageData.Contact.email
                      : "loading"}
                  </a>
                  <span className="break-line" />
                  <a
                    className="emailLink"
                    href="mailto:hung.trinh_hungking@hcmut.edu.vn"
                  >
                    hung.trinh_hungking@hcmut.edu.vn
                  </a>
                </p>
              </div>
            </Grid>
            <Grid item md={12}>
              <div className="row">
                <div className="social">
                  <ul>
                    <li>
                      <a
                        href={
                          landingPageData.Contact
                            ? landingPageData.Contact.facebook
                            : "/"
                        }
                      >
                        <i className="fa fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={
                          landingPageData.Contact
                            ? landingPageData.Contact.twitter
                            : "/"
                        }
                      >
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a
                        href={
                          landingPageData.Contact
                            ? landingPageData.Contact.youtube
                            : "/"
                        }
                      >
                        <i className="fa fa-youtube" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
        {/* </div> */}
      </Grid>
      <div id="footer">
        <div className="container text-center">
          <p>
            &copy; 2023 StudyAll. Design by{" "}
            <a href="http://www.studyall.com" rel="nofollow">
              StudyAll
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
