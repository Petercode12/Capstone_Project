import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import Safe from "react-safe";
import {
  SimpleForm,
  SaveButton,
  Toolbar,
  Edit,
  useCreate,
  useNotify,
  useGetRecordId,
  useGetIdentity,
} from "react-admin";
import { RichTextInput, RichTextInputToolbar } from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  useMediaQuery,
  useTheme,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  InputAdornment,
} from "@mui/material";
import "../Style/PracticeResult.css";
import target from "../Images/target.png";
import hourglass from "../Images/hourglass.png";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export function PracticeResult() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [time, setTime] = useState(0);
  const [testInfo, setTestInfo] = useState({});
  const params = useParams();
  console.log("param id: ", params.id);
  let infinity = "♾️";

  useEffect(() => {
    axios
      .get("http://localhost:8000/test_result/".concat(params.id))
      .then((res) => {
        console.log("Test Result: ", res.data);
        setTestInfo(res.data["test_info"]);
        console.log(
          "Time taken: ",
          res.data["test_info"]["Start_time"].getHours
        );
        var start = testInfo["Start_time"];
        var end = testInfo["End_time"];
        var diff = start
          .split(":")
          .map(
            (item, index) => end.split(":")[index] - item
          )
          .join(":");
        console.log(diff);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Container
      xs="lg"
      sx={{
        marginTop: "2em",
        marginBottom: "2em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          {/* <Item>xs=8</Item> */}
          <div className="TestResult-ButtonGroup">
            <Button
              variant="contained"
              size="small"
              style={{ borderRadius: "15px" }}
              // borderRadius: "50vh"
              onClick={() => {}}
            >
              View answer
            </Button>
            <Button
              variant="outlined"
              size="small"
              style={{ borderRadius: "15px" }}
              onClick={() => {}}
            >
              Do again
            </Button>
          </div>
          <div className="TestResult-BoxDetail NavigationAsidePaper">
            <div>
              <div
                style={{
                  transform: "translateY(2px)",
                  display: "inline-block",
                }}
              >
                <DoneOutlineIcon
                  fontSize="medium"
                  color="primary"
                  style={{ color: "green" }}
                  sx={{ margin: "0px 4px" }}
                />
              </div>
              <Typography
                variant="h6"
                display="inline"
                style={{ color: "blue" }}
              >
                Result:
              </Typography>
            </div>
            <div>
              <div
                style={{
                  transform: "translateY(2px)",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
              >
                <Box
                  component="img"
                  src={target}
                  alt="StudyAll Logo"
                  width="24px"
                  height="auto"
                  margin="0 4px"
                />
              </div>
              <div style={{ display: "inline-block" }}>
                <Typography
                  variant="h6"
                  // display="inline"
                  style={{ color: "blue" }}
                >
                  Accuracy:
                </Typography>
                <Typography
                  variant="body1"
                  // display="inline"
                >
                  #right/#total
                </Typography>
              </div>
            </div>
            <div>
              <div
                style={{
                  transform: "translateY(4px)",
                  display: "inline-block",
                  verticalAlign: "top",
                }}
              >
                <Box
                  component="img"
                  src={hourglass}
                  alt="Time Logo"
                  width="24px"
                  height="20px"
                  margin="0 4px"
                />
              </div>
              <Typography
                variant="h6"
                display="inline"
                style={{ color: "blue" }}
              >
                Time completion:
              </Typography>
            </div>
          </div>
          {/* <div
            // container
            spacing={2}
            className="GridContainer"
          >
            {examList.map((exam, i) => {
              if (exam["description"] === "") {
                exam["description"] = "No description";
              }
              if (exam["duration"] === 0) {
                exam["duration"] = infinity;
              }
              return (
                <div item key={i} className="GridPaper">
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
                        inline
                        color="text.secondary"
                        InputProps={{
                          readOnly: true,
                        }}
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
                      <Button size="small">Edit</Button>
                      <Button size="small">Practice</Button>
                    </CardActions>
                  </Card>
                </div>
              );
            })}
          </div> */}
        </Grid>
        <Grid item xs={4}>
          <Item>xs=4</Item>
        </Grid>
      </Grid>
    </Container>
  );
}
