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
import total_question from "../Images/total_question.png";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
export function PracticeResult() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [time, setTime] = useState(0);
  const [testInfo, setTestInfo] = useState({});
  const [testSpecific, setTestSpecific] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [skipQuestion, setSkipQuestion] = useState(0);
  const [numsConsQuestion, setNumsConsQuestion] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const params = useParams();
  console.log("param id: ", params.id);
  let infinity = "♾️";

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
        var diff = start
          .split(":")
          .map((item, index) => (end.split(":")[index] - item).toFixed(0))
          .join(":");
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
              Back to exam page
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          {/* <Item>xs=8</Item> */}
          <div className="TestResult-BoxDetail NavigationAsidePaper">
            <div style={{ margin: "0 4px" }}>
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
              <Typography
                variant="h6"
                display="inline"
                style={{ color: "blue" }}
              >
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
              <Typography
                variant="h6"
                display="inline"
                style={{ color: "blue" }}
              >
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
                <Typography variant="h6" style={{ color: "blue" }}>
                  Accuracy:
                </Typography>
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
              <Typography
                variant="h6"
                display="inline"
                style={{ color: "blue" }}
              >
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
                <div classname="result-score-subtext">question</div>
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
                <div classname="result-score-subtext">question</div>
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
                <div classname="result-score-subtext">question</div>
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
                <div classname="result-score-subtext">question</div>
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
              let isMCQ = exam["Is_MCQ"];
              let userAnswer, correctAnswer;

              if (isMCQ) {
                if (exam["User_answer_MCQ"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_MCQ"];
                correctAnswer = exam["Correct_answer"];
              } else {
                if (exam["User_answer_CONS"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_CONS"];
                correctAnswer = exam["Solution"];
              }

              return (
                <div className="result-answers-item">
                  <span className="question-number">
                    <strong>{i + 1}</strong>
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
                        color: "red",
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
              let isMCQ = exam["Is_MCQ"];
              let userAnswer, correctAnswer;

              if (isMCQ) {
                if (exam["User_answer_MCQ"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_MCQ"];
                correctAnswer = exam["Correct_answer"];
              } else {
                if (exam["User_answer_CONS"] === "")
                  userAnswer = "Not anwsered!";
                else userAnswer = exam["User_answer_CONS"];
                correctAnswer = exam["Solution"];
              }
              if (temp != null && temp[i] != null) {
                if (isMCQ && userAnswer === correctAnswer)
                  temp[i].lastChild.className =
                    "text-correct fas fa-check fa-lg correct-icon";
                else if (isMCQ && userAnswer !== correctAnswer)
                  temp[i].lastChild.className =
                    "text-wrong fas fa-times fa-lg wrong-icon";
                else if (!isMCQ) {
                  temp[i].lastChild.className =
                    "text-constructive fas fa-pencil-alt fa-lg wrong-icon";
                } else {
                  temp[i].lastChild.className =
                    "text-unanswer fas fa-minus fa-lg hyphen-icon";
                }
                console.log("temp: ", temp[i].lastChild);
              }
              return "";
            })}
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}
