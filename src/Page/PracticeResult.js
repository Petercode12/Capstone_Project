import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  useRedirect,
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
import total_question from "../Images/total_question.png";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function PracticeResult() {
  const [time, setTime] = useState(0);
  const [testInfo, setTestInfo] = useState({});
  const [testSpecific, setTestSpecific] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [skipQuestion, setSkipQuestion] = useState(0);
  const [numsConsQuestion, setNumsConsQuestion] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const params = useParams();
  const params1 = new URLSearchParams();
  const redirect = useRedirect();
  params1.append("id", params.id);
  params1.append("exam_id", testInfo["exam_id"]);
  function calculateIndexMinusNumOfAudio(i) {
    let numOfAudio = 0;
    let numOfParagraph = 0;
    for (let x = 0; x < i; x++) {
      console.log(testSpecific[x].Type);
      if (testSpecific[x].Type === "Audio") {
        numOfAudio += 1;
      }
      if (testSpecific[x].Type === "Paragraph") {
        numOfParagraph += 1;
      }
    }
    return i + 1 - numOfAudio - numOfParagraph;
  }
  function hmsToSeconds(t) {
    const [hours, minutes, seconds] = t.split(":");
    return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
  }

  function secondsToHMS(secs) {
    return new Date(secs * 1000).toISOString().substr(11, 8);
  }
  useEffect(() => {
    axios
      .get("http://localhost:8000/test_result/".concat(params.id))
      .then((res) => {
        console.log("Test Result: ", res.data);
        setTestInfo(res.data["test_info"]);
        setTestSpecific(res.data["test_specific"]);
        setTotalQuestion(res.data["total_question"]);
        setSkipQuestion(res.data["skip_question"]);
        setNumsConsQuestion(res.data["nums_cons_question"]);
        if (res.data["test_info"]["Score"] > 0) {
          setAccuracy(
            (
              res.data["test_info"]["Score"] /
              (res.data["total_question"] - res.data["nums_cons_question"])
            ).toFixed(2) * 100
          );
        } else {
          setAccuracy(0);
        }
        console.log("Test specific: ", res.data["test_specific"]);
        var start = res.data["test_info"]["Start_time"];
        var end = res.data["test_info"]["End_time"];
        var diff = secondsToHMS(hmsToSeconds(end) - hmsToSeconds(start));
        console.log("Time done: ", diff);
        setTime(diff);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Container
      xs="md"
      sx={{
        marginTop: "2em",
        marginBottom: "2em",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="TestResult-ButtonGroup">
            <Button
              variant="contained"
              size="small"
              style={{ borderRadius: "15px" }}
              onClick={() => {
                // show trang đề thi nhưng có đáp án
                redirect(
                  "/app/practice_tests/result_specific?" + params1.toString()
                );
              }}
            >
              View answer
            </Button>
            <Button
              variant="outlined"
              size="small"
              style={{ borderRadius: "15px" }}
              onClick={() => {
                redirect("/app/practice_tests");
              }}
            >
              Back to exam page
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <Item>xs=8</Item> */}
          <div className="TestResult-BoxDetail TestResultPaper">
            <div style={{ margin: "1px 4px" }}>
              <div
                style={{
                  transform: "translateY(2px)",
                  display: "inline-block",
                }}
              >
                <Box
                  component="img"
                  src={total_question}
                  alt="total"
                  width="24px"
                  height="auto"
                  margin="0 4px"
                />
              </div>
              <Typography variant="h6" display="inline">
                Total questions:
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                style={{ float: "right" }}
                className="result-stats-text"
              >
                {totalQuestion}
              </Typography>
            </div>
            <div style={{ margin: "0 4px" }}>
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
              <Typography variant="h6" display="inline">
                Result:
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                style={{ float: "right" }}
                className="result-stats-text"
              >
                {testInfo["Score"]}/{totalQuestion - numsConsQuestion}
              </Typography>
            </div>
            <div style={{ margin: "0 4px" }}>
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
                <Typography variant="h6">Accuracy:</Typography>
                <Typography variant="body1">(#right/#total)</Typography>
              </div>
              <div
                style={{ display: "inline-block", float: "right" }}
                className="result-stats-text"
              >
                <Typography variant="h6" style={{ float: "left" }}>
                  {accuracy}%
                </Typography>
                <Typography variant="body1" />
              </div>
            </div>
            <div style={{ margin: "0 4px" }}>
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
              <Typography variant="h6" display="inline">
                Time completion:
              </Typography>
              <Typography
                variant="h6"
                display="inline"
                style={{ float: "right" }}
                className="result-stats-text"
              >
                {time}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <div className="row">
            <div className="col">
              <div className="result-score-box">
                <div className="result-score-icon text-correct">
                  <span className="fas fa-check-circle" />
                </div>
                <div className="result-score-icontext text-correct">Right</div>
                <div className="result-score-text">{testInfo["Score"]}</div>
                <div className="result-score-subtext">
                  {testInfo["Score"] > 1 ? "questions" : "question"}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="result-score-box">
                <div className="result-score-icon text-wrong">
                  <span className="fas fa-times-circle" />
                </div>
                <div className="result-score-icontext text-wrong">Wrong</div>
                <div className="result-score-text">
                  {totalQuestion -
                    numsConsQuestion -
                    skipQuestion -
                    testInfo["Score"]}
                </div>
                <div className="result-score-subtext">question</div>
              </div>
            </div>
            <div className="col">
              <div className="result-score-box">
                <div className="result-score-icon text-unanswered">
                  <span className="fas fa-minus-circle" />
                </div>
                <div className="result-score-icontext text-unanswered">
                  Unanswered
                </div>
                <div className="result-score-text">{skipQuestion}</div>
                <div className="result-score-subtext">
                  {skipQuestion > 1 ? "questions" : "question"}
                </div>
              </div>
            </div>
            <div className="col">
              <div className="result-score-box">
                <div className="result-score-icon text-constructive">
                  <span className="fas fa-pencil-alt" />
                </div>
                <div className="result-score-icontext text-constructive">
                  Constructive
                </div>
                <div className="result-score-text">{numsConsQuestion}</div>
                <div className="result-score-subtext">
                  {numsConsQuestion > 1 ? "questions" : "question"}
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            display="inline-block"
            style={{
              textDecoration: "underline",
              marginRight: "12px",
              marginBottom: "12px",
            }}
          >
            Details:
          </Typography>
          <div spacing={2} className="result-detail-box result-answers-list">
            {testSpecific.map((exam, i) => {
              let type = exam["Type"];
              if (type === "Audio" || type === "Paragraph") return "";
              let userAnswer, correctAnswer;
              let calculatedIndex = calculateIndexMinusNumOfAudio(i);
              console.log(i, calculatedIndex);
              if (type === "MCQ") {
                if (exam["User_answer_MCQ"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_MCQ"];
                correctAnswer = exam["Correct_answer"];
              } else if (type === "Cons") {
                if (exam["User_answer_CONS"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_CONS"];
                correctAnswer = exam["Solution"];
              } else if (type === "FIB") {
                if (exam["User_answer_FIB"]) userAnswer = "Not anwsered!";
                console.log(
                  "FIB: ",
                  exam["User_answer_FIB"],
                  exam["Solution_FIB"],
                  typeof exam["User_answer_FIB"]
                );

                return (
                  <div className="result-answers-item">
                    <span className="question-number">
                      <strong>{calculatedIndex}</strong>
                    </span>
                    {exam
                      ? typeof exam["User_answer_FIB"] ===
                        typeof []
                        ? exam["User_answer_FIB"].map(
                            (value, index) => {
                              let compare =
                                value.toUpperCase() ===
                                exam["Solution_FIB"][
                                  index
                                ].toUpperCase();

                              return (
                                <div
                                  style={{
                                    display: "inline-block",
                                    marginRight: "20px",
                                  }}
                                >
                                  <span>
                                    <Typography
                                      variant="h6"
                                      display="inline"
                                      className="text-answerkey"
                                    >
                                      {
                                        exam["Solution_FIB"][
                                          index
                                        ]
                                      }
                                      :
                                    </Typography>
                                    <span
                                      style={{
                                        marginRight: "0.25em",
                                      }}
                                    >
                                      &nbsp;
                                    </span>
                                    <span className="mr-1 text-useranswer">
                                      {value === " "
                                        ? "Not anwsered!"
                                        : value}
                                    </span>
                                  </span>
                                  <span
                                    className={
                                      value === " "
                                        ? "text-unanswer fas fa-minus fa-lg hyphen-icon"
                                        : compare
                                        ? "text-correct fas fa-check fa-lg correct-icon"
                                        : "text-wrong fas fa-times fa-lg wrong-icon"
                                    }
                                  />
                                  <br />
                                </div>
                              );
                            }
                          )
                        : ""
                      : ""}
                  </div>
                );
              }

              return (
                <div className="result-answers-item">
                  <span className="question-number">
                    <strong>{calculatedIndex}</strong>
                  </span>
                  <span>
                    <Typography
                      variant="h6"
                      display="inline"
                      className="text-answerkey"
                    >
                      {correctAnswer}:
                    </Typography>
                    <span
                      style={{
                        marginRight: "0.25em",
                        display: "inline-block",
                      }}
                    >
                      &nbsp;
                    </span>
                    <span className="mr-1 text-useranswer">{userAnswer}</span>
                  </span>
                  <span className="" />
                </div>
              );
            })}
            {testSpecific.map((exam, i) => {
              let temp = document.querySelectorAll(".result-answers-item");
              let type = exam["Type"];
              if (type === "Audio" || type === "FIB" || type === "Paragraph")
                return "";
              let userAnswer, correctAnswer;
              let calculatedIndex = calculateIndexMinusNumOfAudio(i);
              if (type === "MCQ") {
                if (exam["User_answer_MCQ"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_MCQ"];
                correctAnswer = exam["Correct_answer"];
              } else if (type === "Cons") {
                if (exam["User_answer_CONS"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_CONS"];
                correctAnswer = exam["Solution"];
              }
              if (temp != null && temp[calculatedIndex - 1] != null) {
                if (type === "MCQ" && userAnswer === correctAnswer)
                  temp[calculatedIndex - 1].lastChild.className =
                    "text-correct fas fa-check fa-lg correct-icon";
                else if (
                  type === "MCQ" &&
                  exam["User_answer_MCQ"] !== "" &&
                  userAnswer !== correctAnswer
                )
                  temp[calculatedIndex - 1].lastChild.className =
                    "text-wrong fas fa-times fa-lg wrong-icon";
                else if (type === "Cons") {
                  console.log("YES", i);
                  temp[calculatedIndex - 1].lastChild.className =
                    "text-constructive fas fa-pencil-alt fa-lg";
                } else {
                  temp[calculatedIndex - 1].lastChild.className =
                    "text-unanswer fas fa-minus fa-lg hyphen-icon";
                }
              }
              return "";
            })}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
