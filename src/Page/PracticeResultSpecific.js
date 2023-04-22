import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
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
  Error404,
} from "react-admin";
import { RichTextInput, RichTextInputToolbar } from "ra-input-rich-text";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import Countdown from "react-countdown";
import { Container, Grid } from "@mui/material";
import "../Style/PracticeResultSpecific.css";
import "../Style/PracticeStyle.css";
import { NotFound } from "./NotFound";
import { eventWrapper, wait } from "@testing-library/user-event/dist/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { MathJaxContext, MathJax } from "better-react-mathjax";
function convertQueryDataToQuestionList(data) {
  let questionList = []; // questionList bao gồm: questionText, answerOptions, correctAnswer đối với MCQ, type, câu trả lời và điểm số.
  for (let e of data) {
    let k = {};
    if (e.Type === "MCQ") {
      k = {
        questionText: e.Question,
        answerOptions: [
          { answerText: e.Answer_a },
          { answerText: e.Answer_b },
          { answerText: e.Answer_c },
          { answerText: e.Answer_d },
        ],
        correctAnswer: e.Correct_answer,
        userAnswer: e.User_answer_MCQ,
        type: "MCQ",
        mark: e.Mark,
      };
    } else if (e.Type === "Cons"){
      k = {
        questionText: e.Question,
        answerOptions: e.Solution,
        userAnswer: e.User_answer_CONS,
        type: "Cons",
      };
    }
    questionList.push(k);
  }
  console.log("Question List: ", questionList);
  return questionList;
}
// const CssTextField = styled(TextField)({
//   "& label.Mui-focused": {
//     color: "green",
//   },
//   "& .MuiInput-underline:after": {
//     borderBottomColor: "red",
//   },
//   "& label": {
//     color: "green",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "green",
//     },
//     "&:hover fieldset": {
//       borderColor: "green",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "green",
//     },
//   },
// });
export const PraceticeResultSpecific = () => {
  //edit create test
  const [questionList, setQuestionList] = useState([]); // list các câu hỏi bao gồm biến và đáp án
  const [create, { error }] = useCreate();
  const location = useLocation();
  const params1 = new URLSearchParams();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const exam_id = searchParams.get("exam_id");
  console.log("ID test: ", id, "\nExam id: ", exam_id);
  params1.append("name", "John");
  params1.append("age", "32");
  // console.log("Param: ", params1.toString());
  const [time, setTime] = useState(0);
  const params = useParams();
  const { data: userInfo, isLoading, error1 } = useGetIdentity();
  const redirect = useRedirect();
  const config = {
    loader: { load: ["input/asciimath"] },
  };
  let navigate = useNavigate();
  let text_blue =
    '{ "& label.Mui-focused" : { "color":"#3cb46e" },' +
    '"& .MuiInput-underline:after" : { "borderBottomColor":"#3cb46e" },' +
    '"& label" : { "color":"#3cb46e" },' +
    '"& .MuiOutlinedInput-root": { "& fieldset": {  "borderColor": "#3cb46e" },' +
    '"&:hover fieldset": {  "borderColor": "#3cb46e" },' +
    '"&.Mui-focused fieldset": {  "borderWidth": "1px", "borderColor":"#3cb46e" }}' +
    "}";
  let text_red =
    '{ "& label.Mui-focused" : { "color":"red" },' +
    '"& .MuiInput-underline:after" : { "borderBottomColor":"red" },' +
    '"& label" : { "color":"red" },' +
    '"& .MuiOutlinedInput-root": { "& fieldset": {  "borderColor": "red" },' +
    '"&:hover fieldset": {  "borderColor": "red" },' +
    '"&.Mui-focused fieldset": {  "borderWidth": "1px", "borderColor":"red" }}' +
    "}";
  let text_yellow =
    '{ "& label.Mui-focused" : { "color":"#ccc129" },' +
    '"& .MuiInput-underline:after" : { "borderBottomColor":"#ccc129" },' +
    '"& label" : { "color":"#ccc129" },' +
    '"& .MuiOutlinedInput-root": { "& fieldset": {  "borderColor": "#ccc129" },' +
    '"&:hover fieldset": {  "borderColor": "#ccc129" },' +
    '"&.Mui-focused fieldset": {  "borderWidth": "1px", "borderColor":"#ccc129" }}' +
    "}";
  // #ccc129
  let text_gray =
    '{ "& label.Mui-focused" : { "color":"#71869d" },' +
    '"& .MuiInput-underline:after" : { "borderBottomColor":"#71869d" },' +
    '"& label" : { "color":"#71869d" },' +
    '"& .MuiOutlinedInput-root": { "& fieldset": {  "borderColor": "#71869d" },' +
    '"&:hover fieldset": {  "borderColor": "#71869d" },' +
    '"&.Mui-focused fieldset": {  "borderWidth": "1px", "borderColor":"#71869d" }}' +
    "}";
  const blue_color = JSON.parse(text_blue);
  const red_color = JSON.parse(text_red);
  const yellow_color = JSON.parse(text_yellow);
  const gray_color = JSON.parse(text_gray);
  useEffect(() => {
    // get the data from the api
    axios
      .get("http://localhost:8000/test_result/".concat(id))
      .then((res) => {
        setQuestionList(
          convertQueryDataToQuestionList(res.data["test_specific"])
        );
        var start = res.data["test_info"]["Start_time"];
        var end = res.data["test_info"]["End_time"];
        var diff = start
          .split(":")
          .map((item, index) =>
            Math.max((end.split(":")[index] - item).toFixed(0), 0)
          )
          .join(":");
        console.log("Time done: ", diff);
        setTime(diff);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const PostEditToolbar1 = () => (
    //nút save của trang edit test
    <Toolbar style={{ display: "none" }}>
      <Box sx={{ "& > button": { m: 0 } }}>{/* <LoadingButton /> */}</Box>
    </Toolbar>
  );

  const scrolltoId = (target) => {
    let access = document.getElementById(target);
    if (access !== null) {
      access.scrollIntoView({ behavior: "smooth" }, true);
    }
  };

  const addNavigationMenu = () => {
    let buttonGroupList = [];
    let buttonList = [];
    if (questionList.length < 4) {
      for (let i = 1; i <= questionList.length; i++) {
        buttonList.push(
          <Button
            xs={{ margin: 0, p: 0, minWidth: 30, py: 0.25 }}
            variant="outlined"
            onClick={() => {
              scrolltoId("question".concat(i));
            }}
            size="small"
          >
            {i}
          </Button>
        );
      }
      buttonGroupList.push(
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {buttonList}
        </ButtonGroup>
      );
    } else {
      for (let i = 1; i <= questionList.length; i++) {
        if (i % 4 !== 0) {
          buttonList.push(
            <Button
              onClick={() => {
                scrolltoId("question".concat(i));
              }}
              size="small"
            >
              {i}
            </Button>
          );
        } else {
          buttonList.push(
            <Button
              onClick={() => {
                scrolltoId("question".concat(i));
              }}
              size="small"
            >
              {i}
            </Button>
          );
          buttonGroupList.push(
            <ButtonGroup variant="outlined" aria-label="outlined button group">
              {buttonList}
            </ButtonGroup>
          );
          buttonList = [];
        }
      }
      buttonGroupList.push(
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {buttonList}
        </ButtonGroup>
      );
    }
    return buttonGroupList;
  };
  let stringToHTML = (str) => {
    let dom = document.createElement("div");
    dom.style.cssText = "line-break: anywhere;";
    dom.innerHTML = str;
    // console.log("dom: ", dom, typeof dom, str);
    // console.log("dom html: ", dom.firstChild.innerHTML);
    return dom;
  };
  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    for (let i = 0; i < questionList.length; i++) {
      var bien = "questionText-label";
      if (
        document.getElementById(bien) !== null &&
        document.getElementById(bien).style.width !== null
      )
        document.getElementById(bien).style.width = "100%";
      var div_question = document.querySelector(".question-".concat(i + 1));
      let temp = stringToHTML(`${questionList[i].questionText}`);
      if (div_question != null) {
        div_question.parentNode.replaceChild(temp, div_question);
      }
    }

    return (
      <span style={{ color: "black" }}>
        {time}
        {/* {hours}:{minutes}:{seconds} */}
      </span>
    );
  };
  const Aside = () => (
    <Box
      className="NavigationAside"
      sx={{
        position: "fixed",
        display: "flex",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <Paper className="NavigationAsidePaper">
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            padding: "8px 0px",
            minWidth: "170px",
          }}
        >
          Question List
        </div>
        <div>Time completion</div>
        <div style={{ paddingBottom: "8px" }}>
          <div
            style={{
              transform: "translateY(5px)",
              display: "inline-block",
            }}
          >
            <AccessTimeIcon
              fontSize="medium"
              color="primary"
              sx={{ margin: "0px 4px" }}
            />
          </div>
          <div
            style={{
              paddingTop: "-15px",
              display: "inline-block",
            }}
          >
            <Countdown date={Date.now()} renderer={renderer} />
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "8px",
            "& > *": {
              m: 1,
            },
          }}
        >
          {addNavigationMenu()}
        </Box>
      </Paper>
    </Box>
  );
  if (id == null) {
    // <Navigate to="/" />;
    return <NotFound />;
  }
  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12} sm={8} md={9} lg={10} style={{ paddingTop: "48px" }}>
          <div style={{ marginTop: "14px" }}>
            <SimpleForm
              toolbar={<PostEditToolbar1 />}
              className="NavigationAsidePaper"
            >
              <div className="multipleChoice">
                <div className="question-section">
                  <div className="question-text">
                    {questionList.map((question, i) => {
                      if (question.type === "MCQ") {
                        return (
                          <div
                            key={i}
                            style={{
                              display: "block",
                              width: "100%",
                            }}
                          >
                            <div
                              className="question-count"
                              style={{
                                marginTop: "1em",
                              }}
                              id={"question".concat(i + 1)}
                            >
                              <span>Question {i + 1}</span>
                              <span
                                style={{
                                  marginRight: "0.25em",
                                  display: "inline-block",
                                }}
                              >
                                &nbsp;
                              </span>

                              {questionList[i].mark === 1 ? (
                                <span className="text-correct fas fa-check fa-lg correct-icon " />
                              ) : (
                                <span className="text-wrong fas fa-times fa-lg wrong-icon " />
                              )}
                            </div>
                            <MathJaxContext config={config}>
                              <MathJax>
                                <div
                                  style={{
                                    width: "100%",
                                  }}
                                  className={"question-".concat(i + 1)}
                                />
                              </MathJax>
                            </MathJaxContext>
                            <RadioGroup
                              row
                              disabled
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              style={{
                                marginTop: "0.5em",
                                marginLeft: "0px",
                              }}
                              defaultValue={questionList[i].userAnswer}
                              id={"textAnswerMCQ".concat(i)}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  marginBottom: "1em",
                                }}
                              >
                                <FormControlLabel
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  value="A"
                                  control={<Radio />}
                                  label=""
                                />
                                <Box
                                  // component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer1"
                                    id={"textAnswerA".concat(i)}
                                    label="Answer A"
                                    variant="outlined"
                                    sx={() => {
                                      return questionList[i].correctAnswer ===
                                        "A"
                                        ? blue_color
                                        : red_color;
                                    }}
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    defaultValue={
                                      questionList[i].answerOptions[0]
                                        .answerText
                                    }
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  marginBottom: "1em",
                                }}
                              >
                                <FormControlLabel
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  value="B"
                                  control={<Radio />}
                                  label=""
                                />
                                <Box
                                  // component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer1"
                                    id={"textAnswerB".concat(i)}
                                    label="Answer B"
                                    variant="outlined"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={() => {
                                      return questionList[i].correctAnswer ===
                                        "B"
                                        ? blue_color
                                        : red_color;
                                    }}
                                    defaultValue={
                                      questionList[i].answerOptions[1]
                                        .answerText
                                    }
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  marginBottom: "1em",
                                }}
                              >
                                <FormControlLabel
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  value="C"
                                  control={<Radio />}
                                  label=""
                                />
                                <Box
                                  // component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer1"
                                    id={"textAnswerC".concat(i)}
                                    label="Answer C"
                                    variant="outlined"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={() => {
                                      return questionList[i].correctAnswer ===
                                        "C"
                                        ? blue_color
                                        : red_color;
                                    }}
                                    defaultValue={
                                      questionList[i].answerOptions[2]
                                        .answerText
                                    }
                                  />
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  marginBottom: "1em",
                                }}
                              >
                                <FormControlLabel
                                  style={{
                                    pointerEvents: "none",
                                  }}
                                  value="D"
                                  control={<Radio />}
                                  label=""
                                />
                                <Box
                                  // component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer1"
                                    id={"textAnswerD".concat(i)}
                                    label="Answer D"
                                    variant="outlined"
                                    InputProps={{
                                      readOnly: true,
                                    }}
                                    sx={() => {
                                      return questionList[i].correctAnswer ===
                                        "D"
                                        ? blue_color
                                        : red_color;
                                    }}
                                    defaultValue={
                                      questionList[i].answerOptions[3]
                                        .answerText
                                    }
                                  />
                                </Box>
                              </Box>
                            </RadioGroup>
                          </div>
                        );
                      } else {
                        return (
                          <div key={i}>
                            <div
                              id={"question".concat(i + 1)}
                              className="question-count"
                              style={{
                                marginTop: "1em",
                              }}
                            >
                              <span>Question {i + 1}</span>
                              <span
                                style={{
                                  marginRight: "0.25em",
                                  display: "inline-block",
                                }}
                              >
                                &nbsp;
                              </span>
                              <span className="text-constructive fas fa-pencil-alt fa-lg" />
                            </div>
                            <MathJaxContext config={config}>
                              <MathJax>
                                <div
                                  style={{
                                    width: "100%",
                                  }}
                                  className={"question-".concat(i + 1)}
                                />
                              </MathJax>
                            </MathJaxContext>
                            <div className="question-answers">
                              <TextField
                                id={"textAnswerCons".concat(i)}
                                label="User Answer"
                                multiline
                                // rows={5}
                                sx={yellow_color}
                                variant="outlined"
                                style={{
                                  width: "100%",
                                }}
                                defaultValue={
                                  questionList[i].userAnswer !== ""
                                    ? questionList[i].userAnswer
                                    : " "
                                }
                                className="constructive"
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </div>
                            <div className="text-correct mt-2">
                              Answer: {questionList[i].answerOptions}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </SimpleForm>
          </div>
        </Grid>
        <Grid item xs={0} sm={4} md={3} lg={2} style={{ paddingTop: "64px" }}>
          <Aside />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            color="primary"
            onClick={() => redirect("/practice_tests/result/".concat(id))}
            loading={false}
            variant="contained"
            className="SaveButton"
            sx={{ marginBottom: "12px", marginTop: "8px" }}
          >
            Back
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  );
};
