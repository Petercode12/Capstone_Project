import React, {
  useState,
  useEffect,
  Component,
  Children,
  isValidElement,
} from "react";
import { connect, Provider } from "react-redux";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
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
import {
  DefaultEditorOptions,
  RichTextInput,
  RichTextInputToolbar,
  LevelSelect,
  FormatButtons,
  AlignmentButtons,
  ListButtons,
  LinkButtons,
  QuoteButtons,
  ClearButtons,
  ColorButtons,
  ImageButtons,
  useTiptapEditor,
} from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import Countdown from "react-countdown";
import {
  useMediaQuery,
  useTheme,
  Container,
  Grid,
  Typography,
  ToggleButton,
} from "@mui/material";
import "../Style/PracticeStyle.css";
import { wait } from "@testing-library/user-event/dist/utils";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import HighlightApp from "./containers/HighlightApp";
import configureStore from "./store/configureStore";
import Form from "./notepads/Form.js";
import TodoList from "./notepads/TodoList.js";
import Stack from "@mui/material/Stack";
import "../Style/NotePad.css";
import Textarea from "react-expanding-textarea";
import { NotFound } from "./NotFound";
let count = 1;
function changeBlankAnswersToEllipsis(temp) {
  let list = getBlankAnswersFromQuestion(temp);
  for (let i = 0; i < list.length; i++) {
    console.log("Temp before: ", temp, `<blank id="${i}">${list[i]}</blank>`);
    console.log(list[i]);
    temp = temp.replace(
      `<blank id="${i}">${list[i]}</blank>`,
      `<strong id="${i}">${i + 1}</strong> ………… `
    );
    console.log("Temp after: ", temp);
  }
  return temp;
}
const BasicHighlight = ({ children, name }) => {
  // console.log("Name: ", name);
  const RenderChild = (children) => {
    return Children.map(children, (child) => {
      console.log("Child text: ", child);
      console.log(child.type, resolveCalssName(child.type));
      if (resolveCalssName(child.type) !== "") {
        return (
          <child.type
            {...child.props}
            children={RenderChild(child.props.children)}
            // className={resolveCalssName(child.type)}
          />
        );
      }

      return <HighlightApp id={++count} questionText={child} />;
    });
  };

  const resolveCalssName = (type) => {
    switch (type) {
      case "thead":
        return "custom-thead-class-name";
      case "tbody":
        return "custom-tbody-class-name";
      case "tr":
        return "custom-tr-class-name";
      case "th":
        return "custom-th-class-name";
      case "td":
        return "custom-td-class-name";
      case "p":
        return "custom-td-class-name";
      case "div":
        return "custom-td-class-name";
      default:
        return "";
    }
  };

  return (
    <div>
      {/* {RenderChild(
        <div
          className={name}
          style={{
            width: "100%",
          }}
        />
      )} */}
      <div
        className={name}
        style={{
          width: "100%",
        }}
      >
        {RenderChild(children)}
      </div>
    </div>
  );
};
function getBlankAnswersFromQuestion(temp) {
  const regex = /<blank id="[0-9]+">/g;
  const regex2 = /<\/blank>/g;
  const found = [...temp.matchAll(regex)];
  const found2 = [...temp.matchAll(regex2)];
  let list = [];
  for (let i = 0; i < found.length; i++) {
    list.push(
      temp.substring(found[i].index + found[i][0].length, found2[i].index)
    );
  }
  return list;
}
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
    } else if (e.Type === "FIB") {
      k = {
        questionText: changeBlankAnswersToEllipsis(e.Question),
        answerOptions: getBlankAnswersFromQuestion(e.Question),
        type: "FIB",
      };
    } else if (e.Type === "Audio") {
      k = {
        fileName: e.audioName,
        file: e.audio,
        type: "Audio",
      };
    } else if (e.Type === "Paragraph") {
      k = {
        questionText: e.Question,
        type: "Paragraph",
      };
    }
    questionList.push(k);
  }
  console.log("Question list: ", questionList);
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
  const data_user = JSON.parse(localStorage.getItem("auth"));
  const [countdown, setCountdown] = useState();
  // Notepad states
  const [todos, setTodos] = useState([]);
  // Notepad states
  const [noteDisplay, setNoteDisplay] = useState("None");
  const redirect = useRedirect();
  var ranges = [];
  const store = configureStore();
  const config = {
    loader: {
      load: ["input/asciimath"],
    },
  };
  var today = new Date();
  const start_time =
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds().toFixed(2);
  let [isAuthority, setIsAuthority] = useState(false);
  useEffect(() => {
    // get the data from the api
    axios
      .get(
        "http://localhost:8000/query_questions_and_answers_by_examid/".concat(
          params.id
        )
      )
      .then((res) => {
        console.log("Api data: ", res.data);
        if (res.data["is_authority"]) {
          for (let i = 0; i < res.data["is_authority"].length; ++i) {
            if (res.data["is_authority"][i] === data_user.id) {
              setIsAuthority(true);
            }
          }
        }
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
      access.scrollIntoView(
        {
          behavior: "smooth",
        },
        true
      );
    }
  };
  function calculateIndexMinusNumOfAudio(i) {
    let numOfAudio = 0;
    let numOfParagraph = 0;

    for (let x = 0; x < i; x++) {
      if (questionList[x].type === "Audio") {
        numOfAudio += 1;
      }
      if (questionList[x].type === "Paragraph") {
        numOfParagraph += 1;
      }
    }
    return i + 1 - numOfAudio - numOfParagraph;
  }
  const addNavigationMenu = () => {
    let buttonGroupList = [];
    let buttonList = [];
    if (questionList.length < 4) {
      for (let i = 0; i < questionList.length; i++) {
        if (
          questionList[i].type !== "Audio" &&
          questionList[i].type !== "Paragraph"
        ) {
          let calculatedIndex = calculateIndexMinusNumOfAudio(i);
          buttonList.push(
            <Button
              xs={{ margin: 0, p: 0, maxWidth: 10, py: 0.25 }}
              variant="outlined"
              onClick={() => {
                scrolltoId("question".concat(calculatedIndex));
              }}
              size="small"
            >
              {calculatedIndex}
            </Button>
          );
        }
      }
      buttonGroupList.push(
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {buttonList}
        </ButtonGroup>
      );
    } else {
      for (let i = 0; i < questionList.length; i++) {
        if (
          questionList[i].type !== "Audio" &&
          questionList[i].type !== "Paragraph"
        ) {
          let calculatedIndex = calculateIndexMinusNumOfAudio(i);
          if (calculatedIndex % 4 !== 0) {
            buttonList.push(
              <Button
                onClick={() => {
                  scrolltoId("question".concat(calculatedIndex));
                }}
                size="small"
              >
                {calculatedIndex}
              </Button>
            );
          } else {
            buttonList.push(
              <Button
                onClick={() => {
                  scrolltoId("question".concat(calculatedIndex));
                }}
                size="small"
              >
                {calculatedIndex}
              </Button>
            );
            buttonGroupList.push(
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
              >
                {buttonList}
              </ButtonGroup>
            );
            buttonList = [];
          }
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
        console.log(i, questionList[i].questionText);
        let temp = stringToHTML(`${questionList[i].questionText}`);
        console.log("Question text: ", questionList[i].questionText);
        let element = div_question.parentNode;
        div_question.parentNode.replaceChild(temp, div_question);
        element = element.firstChild;
        // loop through children element
        // console.log("Get children: ", element.children);
        // [...element.children].map((child) =>
        //   console.log("Child: ", child, child.innerHTML)
        // );
      }
      // var div_question_hl = document.querySelector(
      //   ".questionHL-".concat(i + 1)
      // );
      // if (div_question_hl != null) {
      //   div_question = div_question_hl.firstChild;
      //   div_question.parentNode.replaceChild(
      //     div_question.innerHTML,
      //     div_question
      //   );
      // }
    }
    if (duration > 0) {
      if (completed) {
        // Render a completed state
        return <Completionist />;
      } else {
        // Render a countdown
        return (
          <span
            style={{
              color: "black",
            }}
          >
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
        alignItems: "center",
        maxWidth: "200px",
      }}
    >
      <Stack spacing={2}>
        <Paper
          style={{
            maxHeight: "40vh",
            overflow: "auto",
          }}
          className="NavigationAsidePaper"
        >
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
          <div
            style={{
              paddingBottom: "8px",
            }}
          >
            <div
              style={{
                transform: "translateY(5px)",
                display: "inline-block",
              }}
            >
              <AccessTimeIcon
                fontSize="medium"
                color="primary"
                sx={{
                  margin: "0px 4px",
                }}
              />
            </div>
            <div
              style={{
                paddingTop: "-15px",
                display: "inline-block",
              }}
            >
              <Countdown date={countdown} renderer={renderer} />
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
            sx={{
              marginBottom: "12px",
              marginTop: "8px",
            }}
          >
            Submit
          </LoadingButton>
        </Paper>
        <Paper
          style={{
            marginTop: "1em",
            wordBreak: "break-all",
            maxHeight: "40vh",
            overflow: "auto",
          }}
          className="NavigationAsidePaper"
        >
          <Form todos={todos} setTodos={setTodos} />
          <TodoList setTodos={setTodos} todos={todos} />
        </Paper>
      </Stack>
    </Box>
  );

  const test_result_specific_Gen = async (id) => {
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
          Solution_FIB: null,
          User_answer_MCQ: questionList[i].userAnswer,
          User_answer_CONS: null,
          User_answer_FIB: null,
          Mark: questionList[i].correctAnswer === questionList[i].userAnswer,
          Mark_FIB: null,
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
          Solution_FIB: null,
          User_answer_MCQ: null,
          User_answer_CONS: questionList[i].userAnswer,
          User_answer_FIB: null,
          Mark: 0,
          Mark_FIB: null,
          test_result_id: id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "FIB") {
        let Score = [];
        let check = false;
        if(questionList[i].answerOptions.length > 0) check = true;
        for (let j = 0; j < questionList[i].answerOptions.length; ++j) {
          console.log(
            "So sanh dap an: ",
            questionList[i].answerOptions[j],
            questionList[i].userAnswer[j]
          );
          if (
            questionList[i].answerOptions[j].toUpperCase() ===
              questionList[i].userAnswer[j].toUpperCase() &&
            questionList[i].userAnswer[j] !== ""
          ) {
            Score.push(1);
          } else {
            Score.push(0);
            check = false;
          }
        }
        if (check) {
          nums_right_question += 1;
        }
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Type: "FIB",
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: null,
          Solution_FIB: questionList[i].answerOptions,
          User_answer_MCQ: null,
          User_answer_CONS: null,
          User_answer_FIB: questionList[i].userAnswer,
          Mark: 0,
          Mark_FIB: Score,
          test_result_id: id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "Audio") {
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].fileName,
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: questionList[i].file,
          Solution_FIB: null,
          Type: "Audio",
          User_answer_MCQ: null,
          User_answer_CONS: null,
          User_answer_FIB: null,
          Mark: 0,
          Mark_FIB: null,
          test_result_id: id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "Paragraph") {
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: null,
          Solution_FIB: null,
          Type: "Paragraph",
          User_answer_MCQ: null,
          User_answer_CONS: null,
          User_answer_FIB: null,
          Mark: 0,
          Mark_FIB: null,
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
        console.log("Data save practice test: ", res.data);
        wait(1000);
        redirect("/app/practice_tests/result/".concat(id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function saveTestResultSpecific(data) {
    console.log("DATA specific will be saved: ", data);
    await axios // update lịch sử làm bài và kết quả
      .post(
        "http://localhost:8000/test_result_specific/".concat(params.id),
        data
      )
      .then((res) => {
        console.log("Data save practice test: ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const test_result_Save = async () => {
    handleMCQChange();
    for (let i in questionList) {
      if (questionList[i].type === "MCQ") {
      } else if (questionList[i].type === "Cons") {
        handleTextField_ConsChange(i);
      } else if (questionList[i].type === "FIB") {
        handleFIBChange(i);
      }
    }
    console.log("Question List", questionList);
    var data = test_result_Gen();
    // console.log("DATA TEST", data);
    const id = await test_result_Save_API(data); // post  lich sử làm bài và kết quả
    var [data1, score] = await test_result_specific_Gen(id);
    data = data1;

    await saveTestResultSpecific(data);
    // await create("test_result_specific/", { data }); // post chi tiết bài làm
    console.log("Điểm bài làm: ", score); // update điểm bài làm
    await updateTestMark(score, id);
    if (error) {
      notify("Cannot save!", {
        type: "error",
      });
    } else {
      notify("Save successfully!", {
        type: "success",
      });
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
      newArr[i].userAnswer = value;
    }
    setQuestionList(newArr);
  };
  const handleTextField_ConsChange = (i) => {
    let textFieldElement = document.getElementById("textAnswerCons".concat(i));
    let newArr = [...questionList];
    newArr[i].userAnswer = textFieldElement.value;
    console.log("Answer Cons: ", textFieldElement.value);
    setQuestionList(newArr);
  };
  const handleFIBChange = (i) => {
    console.log("handle FIB change: ", i);
    let result = [];
    let newArr = [...questionList];

    for (let j = 0; j < questionList[i].answerOptions.length; ++j) {
      let textFieldElement = document.getElementById(
        "blankAnswer"
          .concat(j)
          .concat("in")
          .concat(i)
      );
      console.log(
        "đáp án thứ: ",
        j,
        questionList[i].answerOptions[j].answerText,
        textFieldElement.value
      );
      let k = textFieldElement.value;
      if (k === "") k = " ";
      result.push(k);
    }
    console.log("Result: ", result);
    newArr[i].userAnswer = result;
    setQuestionList(newArr);
  };
  let stringToHTML = (str) => {
    let dom = document.createElement("div");
    dom.style.cssText = "line-break: anywhere;";
    dom.innerHTML = str;
    return dom;
  };
  const displayNote = () => {
    if (noteDisplay === "block") {
      setNoteDisplay("None");
    } else {
      setNoteDisplay("block");
    }
  };
  if (!isAuthority) {
    return <NotFound />;
  }
  return (
    <Container
      sx={{
        maxWidth: {
          xl: 1280,
        },
      }}
    >
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12} sm={8} md={9} lg={10} style={{ paddingTop: "24px" }}>
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
                        {/* <HighlightApp
                          id={1}
                          questionText={
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae magna lacus. Sed rhoncus tortor eget venenatis faucibus. Vivamus quis nunc vel eros volutpat auctor. Suspendisse sit amet lorem tristique lectus hendrerit aliquet. Aliquam erat volutpat. Vivamus malesuada, neque at consectetur semper, nibh urna ullamcorper metus, in dapibus arcu massa feugiat erat. Nullam hendrerit malesuada dictum. Nullam mattis orci diam, eu accumsan est maximus quis. Cras mauris nibh, bibendum in pharetra vitae, porttitor at ante. Duis pharetra elit ante, ut feugiat nibh imperdiet eget. Aenean at leo consectetur, sodales sem sit amet, consectetur massa. Ut blandit erat et turpis vestibulum euismod. Cras vitae molestie libero, vel gravida risus. Curabitur dapibus risus eu justo maximus, efficitur blandit leo porta. Donec dignissim felis ac turpis pharetra lobortis. Sed quis vehicula nulla."
                          }
                        /> */}
                        {questionList.map((question, i) => {
                          if (question.type === "MCQ") {
                            let calculatedIndex = calculateIndexMinusNumOfAudio(
                              i
                            );
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
                                  id={"question".concat(calculatedIndex)}
                                >
                                  <span>Question {calculatedIndex}</span>
                                </div>
                                <IconButton
                                  color="primary"
                                  style={{
                                    padding: "2px",
                                  }}
                                  onClick={() => {
                                    displayNote();
                                  }}
                                >
                                  <EditNoteIcon />
                                </IconButton>
                                <TextField
                                  id="textAreaNote"
                                  label="Note here"
                                  className="noteTextField"
                                  placeholder="Start typing ..."
                                  multiline
                                  maxRows={3}
                                  fullWidth
                                  variant="standard"
                                  style={{
                                    marginTop: "2px",
                                    display: noteDisplay,
                                  }}
                                />
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
                                      sx={{
                                        margin: 0,
                                      }}
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
                                      sx={{
                                        margin: 0,
                                      }}
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
                                      sx={{
                                        margin: 0,
                                      }}
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
                                      sx={{
                                        margin: 0,
                                      }}
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
                          } else if (question.type === "Cons") {
                            let calculatedIndex = calculateIndexMinusNumOfAudio(
                              i
                            );
                            return (
                              <div key={i}>
                                <div
                                  id={"question".concat(calculatedIndex)}
                                  className="question-count"
                                  style={{
                                    marginTop: "1em",
                                  }}
                                >
                                  <span>Question {calculatedIndex}</span>
                                </div>
                                <IconButton
                                  color="primary"
                                  style={{
                                    padding: "2px",
                                  }}
                                  onClick={() => {
                                    displayNote();
                                  }}
                                >
                                  <EditNoteIcon />
                                </IconButton>
                                <TextField
                                  id="textAreaNote"
                                  label="Note here"
                                  className="noteTextField"
                                  placeholder="Start typing ..."
                                  multiline
                                  fullWidth
                                  maxRows={3}
                                  variant="standard"
                                  style={{
                                    marginTop: "2px",
                                    display: noteDisplay,
                                  }}
                                />
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
                          } else if (question.type === "FIB") {
                            let calculatedIndex = calculateIndexMinusNumOfAudio(
                              i
                            );
                            return (
                              <div key={i}>
                                <div
                                  id={"question".concat(calculatedIndex)}
                                  className="question-count"
                                  style={{
                                    marginTop: "2em",
                                  }}
                                >
                                  <span>Question {calculatedIndex}</span>
                                </div>
                                <IconButton
                                  color="primary"
                                  style={{
                                    padding: "2px",
                                  }}
                                  onClick={() => {
                                    displayNote();
                                  }}
                                >
                                  <EditNoteIcon />
                                </IconButton>
                                <TextField
                                  id="textAreaNote"
                                  label="Note here"
                                  className="noteTextField"
                                  placeholder="Start typing ..."
                                  multiline
                                  maxRows={3}
                                  fullWidth
                                  variant="standard"
                                  style={{
                                    marginTop: "2px",
                                    display: noteDisplay,
                                  }}
                                />
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
                                {question.answerOptions.map((answer, idx) => {
                                  return (
                                    <div>
                                      <span
                                        className="number"
                                        style={{
                                          marginTop: "5px",
                                          marginRight: "1em",
                                          marginLeft: "10px",
                                          marginBottom: "1em",
                                        }}
                                      >
                                        {idx + 1}
                                      </span>
                                      <TextField
                                        id={"blankAnswer"
                                          .concat(idx)
                                          .concat("in")
                                          .concat(i)}
                                        label="Answer"
                                        variant="outlined"
                                        style={{
                                          position: "relative",
                                          marginTop: "1em",
                                        }}
                                        defaultValue={
                                          ""
                                          // question.answerOptions[idx].answerText
                                        }
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          } else if (question.type === "Audio") {
                            return (
                              <div
                                key={i}
                                style={{
                                  marginTop: "1.5em",
                                  marginBottom: "1.5em",
                                  border: "none",
                                  width: "100%",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  rowGap: "0.5rem",
                                  columnGap: "1rem",
                                  alignItems: "baseline",
                                }}
                              >
                                {questionList[i].file !== "" ? (
                                  <audio
                                    src={questionList[i].file}
                                    controls
                                    style={{
                                      height: "40px",
                                      width: "100%",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </div>
                            );
                          } else if (question.type === "Paragraph") {
                            return (
                              <div
                                key={i}
                                style={{
                                  marginTop: "1em",
                                }}
                              >
                                <MathJaxContext config={config}>
                                  <MathJax>
                                    <HighlightApp
                                      id={i + 1}
                                      questionText={questionList[
                                        i
                                      ].questionText.replace(
                                        /(<([^>]+)>)/gi,
                                        "\n "
                                      )}
                                    />
                                  </MathJax>
                                </MathJaxContext>
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
        <Grid
          item
          xs={0}
          sm={4}
          md={3}
          lg={2}
          style={{
            paddingTop: "40px",
          }}
        >
          <Aside />
        </Grid>
      </Grid>
    </Container>
  );
}
