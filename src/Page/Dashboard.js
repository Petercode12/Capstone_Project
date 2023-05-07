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
} from "@mui/material";
import Button from "@mui/material/Button";

export const Dashboard = () => {
  const { data: userInfo, isLoading, err } = useGetIdentity();
  const [examList, setExamList] = useState([]);
  const redirect = useRedirect();
  let infinity = "♾️";
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

  const data2 = [
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/1200px-GoldenGateBridge-001.jpg",
      caption: "San Francisco",
    },
    {
      image:
        "https://cdn.britannica.com/s:800x450,c:crop/35/204435-138-2F2B745A/Time-lapse-hyper-lapse-Isle-Skye-Scotland.jpg",
      caption: "Scotland",
    },
    {
      image:
        "https://static2.tripoto.com/media/filter/tst/img/735873/TripDocument/1537686560_1537686557954.jpg",
      caption: "Darjeeling",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Palace_of_Fine_Arts_%2816794p%29.jpg/1200px-Palace_of_Fine_Arts_%2816794p%29.jpg",
      caption: "San Francisco",
    },
    {
      image:
        "https://i.natgeofe.com/n/f7732389-a045-402c-bf39-cb4eda39e786/scotland_travel_4x3.jpg",
      caption: "Scotland",
    },
    {
      image:
        "https://www.tusktravel.com/blog/wp-content/uploads/2020/07/Best-Time-to-Visit-Darjeeling-for-Honeymoon.jpg",
      caption: "Darjeeling",
    },
    {
      image:
        "https://www.omm.com/~/media/images/site/locations/san_francisco_780x520px.ashx",
      caption: "San Francisco",
    },
    {
      image:
        "https://images.ctfassets.net/bth3mlrehms2/6Ypj2Qd3m3jQk6ygmpsNAM/61d2f8cb9f939beed918971b9bc59bcd/Scotland.jpg?w=750&h=422&fl=progressive&q=50&fm=jpg",
      caption: "Scotland",
    },
    {
      image:
        "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/02/summer-7.jpg",
      caption: "Darjeeling",
    },
  ];

  const captionStyle = {
    fontSize: "2em",
    fontWeight: "bold",
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
            {examList.map((exam, i) => {
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
                            window.location.href +
                              "practice_tests/" +
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
            })}
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
                class="font-architects-daughter text-xl text-purple-600 mb-2"
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
                style={{ marginLeft: "15%" }}
                alt="MathFormula"
              />
            </div>
          </div>
        </div>
      </div>

      <Carousel
        data={data2}
        time={2000}
        width="850px"
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
    </>
  );
};
