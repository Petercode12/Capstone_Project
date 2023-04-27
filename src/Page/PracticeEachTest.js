import React, { useState, useEffect, Component } from "react";
import { connect, Provider } from "react-redux";
import { useParams } from "react-router-dom";
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
  useGetIdentity,
  useRedirect,
} from "react-admin";
import { RichTextInput, RichTextInputToolbar } from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import Countdown from "react-countdown";
import { useMediaQuery, useTheme, Container, Grid } from "@mui/material";
import "../Style/PracticeStyle.css";
import { wait } from "@testing-library/user-event/dist/utils";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextSelector from "text-selection-react";
import HighlightPop from "react-highlight-pop";
import Highlightable, { Node } from "highlightable";
import { Map, List } from "immutable";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import HighlightApp from "./containers/HighlightApp";
import configureStore from "./store/configureStore";
function convertQueryDataToQuestionList(data) {
  let questionList = []; // questionList bao gồm: questionText, answerOptions, correctAnswer đối với MCQ, type
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
        userAnswer: "",
        correctAnswer: e.Correct_answer,
        type: "MCQ",
      };
    } else if (e.Type === "Cons") {
      k = {
        questionText: e.Question,
        answerOptions: e.Solution,
        userAnswer: "",
        type: "Cons",
      };
    }
    questionList.push(k);
  }
  return questionList;
}

export function PracticeTest() {
  //edit create test
  const [questionList, setQuestionList] = useState([]); // list các câu hỏi bao gồm biến và đáp án
  const [create, { error }] = useCreate();
  const notify = useNotify();
  const params = useParams();
  const [duration, setDuration] = useState();
  const { data: userInfo, isLoading, error1 } = useGetIdentity();
  const [countdown, setCountdown] = useState();
  const redirect = useRedirect();
  var ranges = [];
  const store = configureStore();
  const config = {
    loader: { load: ["input/asciimath"] },
  };
  var today = new Date();
  const start_time =
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds().toFixed(2);

  useEffect(() => {
    // get the data from the api
    axios
      .get(
        "http://localhost:8000/query_questions_and_answers_by_examid/".concat(
          params.id
        )
      )
      .then((res) => {
        console.log("Question List: ", res.data["q_and_a"]);
        // xử lý string
        setQuestionList(convertQueryDataToQuestionList(res.data["q_and_a"]));
        setDuration(res.data["duration"]);
        setCountdown(Date.now() + res.data["duration"] * 60 * 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const PostEditToolbar = () => <Toolbar style={{ display: "none" }} />;

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
  const Completionist = () => {
    // redirect sang trang chấm bài
    return <span style={{ color: "red" }}>Time is up!</span>;
  };
  // Renderer callback with condition
  const renderer = ({ hours, minutes, seconds, completed }) => {
    for (let i = 0; i < questionList.length; i++) {
      var div_question = document.querySelector(".question-".concat(i + 1));
      var bien = "questionText-label";
      if (
        document.getElementById(bien) !== null &&
        document.getElementById(bien).style.width !== null
      )
        document.getElementById(bien).style.width = "100%";

      if (div_question != null) {
        let temp = stringToHTML(`${questionList[i].questionText}`);
        console.log("Question text: ", questionList[i].questionText);
        div_question.parentNode.replaceChild(temp, div_question);
      }
    }
    // console.log("Bị render lại!!!", duration);
    if (duration > 0) {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      } else {
        // Render a countdown
        return (
          <span style={{ color: "black" }}>
            {hours}:{minutes}:{seconds}
          </span>
        );
      }
    }
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
        <div style={{ paddingBottom: "8px" }}>
          <div
            style={{ transform: "translateY(5px)", display: "inline-block" }}
          >
            <AccessTimeIcon
              fontSize="medium"
              color="primary"
              sx={{ margin: "0px 4px" }}
            />
          </div>
          <div style={{ paddingTop: "-15px", display: "inline-block" }}>
            <Countdown
              // date={Date.now() + duration * 60 * 1000}
              date={countdown}
              renderer={renderer}
            />
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": {
              m: 1,
            },
          }}
        >
          {addNavigationMenu()}
        </Box>
        <LoadingButton
          color="primary"
          onClick={() => {
            test_result_Save();
          }}
          loading={false}
          loadingPosition="start"
          variant="contained"
          className="SaveButton"
          sx={{ marginBottom: "12px", marginTop: "8px" }}
        >
          Submit
        </LoadingButton>
      </Paper>
    </Box>
  );

  const test_result_specific_Gen = async (id) => {
    // tạo array dict data của bài làm
    let saveData = []; // array of dict
    let nums_right_question = 0;
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].type === "MCQ") {
        console.log(
          "So sanh dap an: ",
          questionList[i].correctAnswer,
          questionList[i].userAnswer
        );
        if (
          questionList[i].correctAnswer === questionList[i].userAnswer &&
          questionList[i].userAnswer !== ""
        )
          nums_right_question += 1;

        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Type: "MCQ",
          Answer_a: questionList[i].answerOptions[0].answerText,
          Answer_b: questionList[i].answerOptions[1].answerText,
          Answer_c: questionList[i].answerOptions[2].answerText,
          Answer_d: questionList[i].answerOptions[3].answerText,
          Correct_answer: questionList[i].correctAnswer,
          Solution: null,
          User_answer_MCQ: questionList[i].userAnswer,
          User_answer_CONS: null,
          Mark: questionList[i].correctAnswer === questionList[i].userAnswer,
          test_result_id: id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "Cons") {
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Type: "Cons",
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: questionList[i].answerOptions,
          User_answer_MCQ: null,
          User_answer_CONS: questionList[i].userAnswer,
          Mark: 0,
          test_result_id: id,
        };
        saveData.push(k);
      }
    }
    console.log("Số câu đúng: ", nums_right_question);
    return [saveData, nums_right_question];
  };
  const test_result_Gen = () => {
    // tạo array dict data của đề thi
    const data = [];
    var today = new Date();
    var end_time =
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds().toFixed(2);
    console.log("End time: ", end_time);
    let k = {
      Score: 0,
      Start_time: start_time,
      End_time: end_time,
      exam_id: params.id,
      user_id: userInfo["id"],
    };
    data.push(k);
    return data;
  };
  async function test_result_Save_API(data) {
    var id;
    await axios // post  lich sử làm bài và kết quả
      .post("http://localhost:8000/test_result/".concat(params.id), data)
      .then((res) => {
        console.log("Data: ", res.data);
        console.log("ID: ", res.data["id"], typeof res.data["id"]);
        id = res.data["id"];
      })
      .catch((err) => {
        console.log(err);
      });
    return id;
  }
  async function updateTestMark(Score, id) {
    await axios // update lịch sử làm bài và kết quả
      .patch("http://localhost:8000/test_result/".concat(id), { Score })
      .then((res) => {
        console.log("Data: ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const test_result_Save = async () => {
    handleMCQChange();
    for (let i in questionList) {
      if (questionList[i].type === "MCQ") {
      } else {
        handleTextField_ConsChange(i);
      }
    }
    // console.log("Question List", questionList);
    var data = test_result_Gen();
    console.log("DATA TEST", data);
    const id = await test_result_Save_API(data); // post  lich sử làm bài và kết quả
    var [data1, score] = await test_result_specific_Gen(id);
    data = data1;
    console.log("DATA specific will be saved: ", data);
    create("test_result_specific/".concat(params.id), { data }); // post chi tiết bài làm
    console.log("Điểm bài làm: ", score); // update điểm bài làm
    await updateTestMark(score, id);
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      wait(1000);
      redirect("/practice_tests/result/".concat(id));
    }
  };
  const handleMCQChange = () => {
    let valueFieldElement = document.querySelectorAll(".Mui-checked");
    let newArr = [...questionList];
    for (let e of valueFieldElement) {
      let i = e.parentElement.parentElement.parentElement.id.slice(
        "textAnswerMCQ".length
      );
      let value = e.firstChild.value;
      console.log("value all: ", i);
      console.log("value ", ": ", value);
      newArr[i].userAnswer = value;
    }
    setQuestionList(newArr);
    console.log("Update user Answer");
  };
  const handleTextField_ConsChange = (i) => {
    let textFieldElement = document.getElementById("textAnswerCons".concat(i));
    let newArr = [...questionList];
    newArr[i].userAnswer = textFieldElement.value;
    setQuestionList(newArr);
  };
  let stringToHTML = (str) => {
    let dom = document.createElement("div");
    dom.style.cssText = "line-break: anywhere;";
    dom.innerHTML = str;
    return dom;
  };
  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12} sm={8} md={9} lg={10} style={{ paddingTop: "48px" }}>
          <Provider store={store}>
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <Edit
                title="Practice Exam"
                style={{ display: "block" }}
                className="NavigationAsidePaper"
              >
                <SimpleForm
                  toolbar={<PostEditToolbar />}
                  className="NavigationAsidePaper"
                >
                  <div className="multipleChoice">
                    <div className="question-section">
                      <div className="question-text">
                        <div
                          className="highlight-control"
                          style={{
                            top: "100px",
                            position: "fixed",
                            left: "35px",
                            display: "none",
                          }}
                          data-uid="5e66b2aa-4d7b-4f5a-b0de-da35acb292ef"
                        >
                          <div>
                            <span className="fas fa-trash highlight-icon highlight-remove" />
                            <span
                              className="fas fa-pencil highlight-icon highlight-note"
                              style={{}}
                            />
                            <span className="highlight-icon highlight-color blue" />
                            <span className="highlight-icon highlight-color pink" />
                            <span className="highlight-icon highlight-color green" />
                            <span className="highlight-icon highlight-color yellow" />
                            <span className="highlight-icon highlight-color underred" />
                            <span className="highlight-icon highlight-color crossed">
                              abc
                            </span>
                          </div>
                          <div
                            className="highlight-editor"
                            style={{ display: "none" }}
                          >
                            <textarea rows="3" />
                            <div>
                              <span className="far fa-check highlight-icon highlight-save" />
                            </div>
                          </div>
                        </div>
                        <HighlightApp id={1} questionText={'<p><mark data-color="#b71c1c" style="background-color: #b71c1c">abc</mark>defgh Tôi <mark data-color="#e65100" style="background-color: #e65100">là ai a</mark>i <strong>là tôi</strong></p><blockquote><p><strong>abc</strong>xyz<s>fgh</s></p></blockquote><p><MathJaxContext config={config}><MathJax>`(a.4^2+b)/2 \sum13`</MathJax></MathJaxContext></p>'}/>
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
                                  aria-labelledby="demo-row-radio-buttons-group-label"
                                  name="row-radio-buttons-group"
                                  style={{
                                    marginTop: "0.5em",
                                    marginLeft: "0px",
                                  }}
                                  id={"textAnswerMCQ".concat(i)}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      marginBottom: "1em",
                                    }}
                                  >
                                    <FormControlLabel
                                      value="A"
                                      control={<Radio />}
                                      label=""
                                    />
                                    <Box
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
                                      value="B"
                                      control={<Radio />}
                                      label=""
                                    />
                                    <Box
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
                                      value="C"
                                      control={<Radio />}
                                      label=""
                                    />
                                    <Box
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
                                      value="D"
                                      control={<Radio />}
                                      label=""
                                    />
                                    <Box
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

                                <div>
                                  <TextField
                                    id={"textAnswerCons".concat(i)}
                                    label="Answer"
                                    multiline
                                    rows={5}
                                    variant="filled"
                                    style={{
                                      width: "100%",
                                    }}
                                    defaultValue={""}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                </SimpleForm>
              </Edit>
            </MuiThemeProvider>
          </Provider>
        </Grid>
        <Grid item xs={0} sm={4} md={3} lg={2} style={{ paddingTop: "64px" }}>
          <Aside />
        </Grid>
      </Grid>
    </Container>
  );
}
