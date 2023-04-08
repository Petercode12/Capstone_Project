import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Style/PostEditStyle.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { SimpleForm } from "react-admin";
import { ToggleButton } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FunctionsIcon from "@mui/icons-material/Functions";
import Remove from "@mui/icons-material/Remove";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { MathFormulaDialog } from "./MathFormulaDialog";
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
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toolbar, Edit, useCreate, useNotify } from "react-admin";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import { useMediaQuery, useTheme, Container, Grid } from "@mui/material";

function convertQueryDataToQuestionList(data) {
  let questionList = [];
  for (let e of data) {
    let k = {};
    let temp = e.Question.replaceAll(
      "<MathJaxContext config={config}><MathJax>`",
      "&lt;Math&gt;"
    );
    temp = temp.replaceAll("`</MathJax></MathJaxContext>", "&lt;/Math&gt;");
    if (e.Is_MCQ) {
      k = {
        questionText: temp,
        answerOptions: [
          { answerText: e.Answer_a },
          { answerText: e.Answer_b },
          { answerText: e.Answer_c },
          { answerText: e.Answer_d },
        ],
        correctAnswer: e.Correct_answer,
        type: "MCQ",
      };
    } else {
      k = {
        questionText: temp,
        answerOptions: e.Solution,
        type: "Cons",
      };
    }
    questionList.push(k);
  }
  return questionList;
}

export function PostEdit() {
  //edit create test
  const [questionList, setQuestionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState();
  const [create, { error }] = useCreate();
  const notify = useNotify();
  const params = useParams();
  const [
    assignNewValueForElementsCheck,
    setAssignNewValueForElementsCheck,
  ] = useState(false);
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/query_questions_and_answers_by_examid/".concat(
          params.id
        )
      )
      .then((res) => {
        setQuestionList(convertQueryDataToQuestionList(res.data["q_and_a"]));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const insertQA_MCQ = () => {
    setQuestionList([
      ...questionList,
      {
        questionText: "",
        answerOptions: [
          { answerText: "" },
          { answerText: "" },
          { answerText: "" },
          { answerText: "" },
        ],
        correctAnswer: "",
        type: "MCQ",
      },
    ]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const insertQA_Cons = () => {
    setQuestionList([
      ...questionList,
      {
        questionText: "",
        answerOptions: "",
        type: "Cons",
      },
    ]);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };
  const PostEditToolbar = () => (
    //nút save của trang edit test
    <Toolbar>
      <Box sx={{ "& > button": { m: 1 } }}>
        <LoadingButton
          color="primary"
          onClick={() => {
            questions_and_answers_Save();
          }}
          loading={false}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          className="SaveButton"
        >
          Save
        </LoadingButton>
      </Box>
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
            xs={{ margin: 0, p: 0, maxWidth: 10, py: 0.25 }}
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
      </Paper>
    </Box>
  );

  const saveDataGen = () => {
    // tạo array dict data của đề thi
    let saveData = []; // array of dict
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].type === "MCQ") {
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Answer_a: questionList[i].answerOptions[0].answerText,
          Answer_b: questionList[i].answerOptions[1].answerText,
          Answer_c: questionList[i].answerOptions[2].answerText,
          Answer_d: questionList[i].answerOptions[3].answerText,
          Correct_answer: questionList[i].correctAnswer,
          Solution: null,
          Is_MCQ: true,
          exam_id: params.id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "Cons") {
        let k = {
          Ordinal: i + 1,
          Question: questionList[i].questionText,
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: questionList[i].answerOptions,
          Is_MCQ: false,
          exam_id: params.id,
        };
        saveData.push(k);
      }
    }
    return saveData;
  };
  const questions_and_answers_Save = () => {
    for (let i in questionList) {
      if (questionList[i].type === "MCQ") {
        handleQuestionTextChange(i);
        handleTextFieldA_MCQChange(i);
        handleTextFieldB_MCQChange(i);
        handleTextFieldC_MCQChange(i);
        handleTextFieldD_MCQChange(i);
      } else {
        handleQuestionTextChange(i);
        handleTextField_ConsChange(i);
      }
    }
    const data = saveDataGen();

    create("save_questions_and_answers/".concat(params.id), { data });
    if (error) {
      notify("Cannot save!", { type: "error" });
    } else {
      notify("Save successfully!", { type: "success" });
      // update last_modified_date
    }
  };
  const handleMCQChange = (event, i) => {
    let newArr = [...questionList];
    newArr[i].correctAnswer = event.target.value;
    setQuestionList(newArr);
  };
  const handleQuestionTextChange = (i) => {
    let questionTextElement = document.getElementById("questionText".concat(i));
    let newArr = [...questionList];
    newArr[i].questionText = questionTextElement.innerHTML;
    newArr[i].questionText = newArr[i].questionText.replaceAll(
      "&lt;Math&gt;",
      "<MathJaxContext config={config}><MathJax>`"
    );
    newArr[i].questionText = newArr[i].questionText.replaceAll(
      "&lt;/Math&gt;",
      "`</MathJax></MathJaxContext>"
    );
    setQuestionList(newArr);
  };
  const handleTextFieldA_MCQChange = (i) => {
    let textFieldA_Element = document.getElementById("textAnswerA".concat(i));
    let newArr = [...questionList];
    newArr[i].answerOptions[0].answerText = textFieldA_Element.value;
    setQuestionList(newArr);
  };
  const handleTextFieldB_MCQChange = (i) => {
    let textFieldB_Element = document.getElementById("textAnswerB".concat(i));
    let newArr = [...questionList];
    newArr[i].answerOptions[1].answerText = textFieldB_Element.value;
    setQuestionList(newArr);
  };
  const handleTextFieldC_MCQChange = (i) => {
    let textFieldC_Element = document.getElementById("textAnswerC".concat(i));
    let newArr = [...questionList];
    newArr[i].answerOptions[2].answerText = textFieldC_Element.value;
    setQuestionList(newArr);
  };
  const handleTextFieldD_MCQChange = (i) => {
    let textFieldD_Element = document.getElementById("textAnswerD".concat(i));
    let newArr = [...questionList];
    newArr[i].answerOptions[3].answerText = textFieldD_Element.value;
    setQuestionList(newArr);
  };
  const handleTextField_ConsChange = (i) => {
    let textFieldElement = document.getElementById("textAnswerCons".concat(i));
    let newArr = [...questionList];
    newArr[i].answerOptions = textFieldElement.value;
    setQuestionList(newArr);
  };

  // function ẩn hiện thanh insert MCQ
  var currentPageYOffset = 0;
  window.addEventListener(
    "scroll",
    function() {
      var Y = window.pageYOffset;
      var X = window.innerWidth;
      const note = document.querySelector(".InsertButton");
      if (X < 800) {
        if (currentPageYOffset < Y) {
          if (note !== null) {
            note.style.cssText += "margin-top: -52.5px";
          }
        } else if (currentPageYOffset > Y) {
          if (note !== null) {
            note.style.cssText -= "margin-top: -52.5px";
          }
        }
      }
      currentPageYOffset = Y;
    },
    false
  );
  const removeQuestionAndAnswerFromQuestionList = (i) => {
    let newArr = [...questionList];
    newArr.splice(i, 1);
    setQuestionList(newArr);
    setAssignNewValueForElementsCheck(true);
  };

  const assignNewValueForElements = () => {
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].type === "MCQ") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          questionTextElement.innerHTML = questionList[i].questionText;
        }
        // answerText A
        let textFieldA_Element = document.getElementById(
          "textAnswerA".concat(i)
        );
        if (textFieldA_Element !== null) {
          textFieldA_Element.value =
            questionList[i].answerOptions[0].answerText;
        }
        // answerText B
        let textFieldB_Element = document.getElementById(
          "textAnswerB".concat(i)
        );
        if (textFieldB_Element !== null) {
          textFieldB_Element.value =
            questionList[i].answerOptions[1].answerText;
        }
        // answerText C
        let textFieldC_Element = document.getElementById(
          "textAnswerC".concat(i)
        );
        if (textFieldC_Element !== null) {
          textFieldC_Element.value =
            questionList[i].answerOptions[2].answerText;
        }
        // answerText D
        let textFieldD_Element = document.getElementById(
          "textAnswerD".concat(i)
        );
        if (textFieldD_Element !== null) {
          textFieldD_Element.value =
            questionList[i].answerOptions[3].answerText;
        }
        // correctAnswer
        let correctAnswer_Element = document.getElementById(
          "correctAnswer".concat(i)
        );
        if (correctAnswer_Element !== null) {
          correctAnswer_Element.value = questionList[i].correctAnswer;
        }
      } else {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          questionTextElement.innerHTML = questionList[i].questionText;
        }
        // textField
        let textFieldElement = document.getElementById(
          "textAnswerCons".concat(i)
        );
        if (textFieldElement !== null) {
          textFieldElement.value = questionList[i].answerOptions;
        }
      }
    }
  };
  if (assignNewValueForElementsCheck) {
    assignNewValueForElements();
    setAssignNewValueForElementsCheck(false);
  }
  console.log("Questionlist: ", questionList);
  const MyEditorOptions = {
    ...DefaultEditorOptions,
    extensions: [...DefaultEditorOptions.extensions, HorizontalRule],
  };

  const handleClickOpenDialog = (idx) => {
    setIdx(idx);
    setOpen(true);
  };
  const handleCloseDialog = (eq) => {
    if (eq !== null) {
      let questionTextElement = document.getElementById(
        "questionText".concat(idx)
      );
      questionTextElement.innerHTML += `<p>&lt;Math&gt;${eq.substring(
        1,
        eq.length - 1
      )}&lt;/Math&gt</p>`;
    }
    setOpen(false);
  };
  const MyRichTextInputToolbar = ({ size, ...props }) => {
    const editor = useTiptapEditor();
    return (
      <RichTextInputToolbar {...props}>
        <LevelSelect size={size} />
        <FormatButtons size={size} />
        <ColorButtons size={size} />
        <AlignmentButtons size={size} />
        <ListButtons size={size} />
        <LinkButtons size={size} />
        <ImageButtons size={size} />
        <QuoteButtons size={size} />
        <ClearButtons size={size} />
        <ToggleButton
          aria-label="Add an horizontal rule"
          title="Add an horizontal rule"
          value="left"
          onClick={() =>
            editor
              .chain()
              .focus()
              .setHorizontalRule()
              .run()
          }
          selected={editor && editor.isActive("horizontalRule")}
        >
          <Remove fontSize="inherit" />
        </ToggleButton>
        <IconButton
          aria-label="addFormula"
          color="primary"
          onClick={() => handleClickOpenDialog(props.idx)}
        >
          <FunctionsIcon />
        </IconButton>
        <MathFormulaDialog
          open={open}
          setOpen={setOpen}
          handleCloseDialog={handleCloseDialog}
        />
      </RichTextInputToolbar>
    );
  };

  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12}>
          <Grid className="InsertButton">
            <Button
              variant="contained"
              onClick={insertQA_MCQ}
              className="InsertMCQButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> MCQ
            </Button>
            <Button
              variant="contained"
              onClick={insertQA_Cons}
              className="InsertConsButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Constructive Questions
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8} md={9} lg={10} style={{ paddingTop: "48px" }}>
          <Edit
            title="Edit exam"
            style={{ marginTop: "0px", alignItems: "center" }}
            className="NavigationAsidePaper"
          >
            <SimpleForm
              toolbar={<PostEditToolbar />}
              sx={{ padding: "8px", alignItems: "center" }}
              className="NavigationAsidePaper"
            >
              <div className="multipleChoice">
                <div className="question-section">
                  <div className="question-text">
                    {questionList.map((question, i) => {
                      if (question.type === "MCQ") {
                        return (
                          <div key={i}>
                            <div
                              className="question-count"
                              style={{
                                margin: "1em 0em",
                              }}
                              id={"question".concat(i + 1)}
                            >
                              <span>Question {i + 1}</span>
                              <Button
                                variant="outlined"
                                style={{
                                  float: "right",
                                }}
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                  removeQuestionAndAnswerFromQuestionList(i);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                            <RichTextInput
                              id={"questionText".concat(i)}
                              key={i}
                              source=""
                              editorOptions={MyEditorOptions}
                              toolbar={
                                <MyRichTextInputToolbar size="medium" idx={i} />
                              }
                              defaultValue={questionList[i].questionText}
                              className="RichTextContentEdit"
                            />
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                              style={{
                                marginTop: "0.5em",
                                marginLeft: "0px",
                              }}
                              onChange={(event) => {
                                handleMCQChange(event, i);
                              }}
                              defaultValue={questionList[i].correctAnswer}
                              id={"correctAnswer".concat(i)}
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
                                  component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer"
                                    id={"textAnswerA".concat(i)}
                                    label="Answer A"
                                    variant="outlined"
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
                                  component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer"
                                    id={"textAnswerB".concat(i)}
                                    label="Answer B"
                                    variant="outlined"
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
                                  component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer"
                                    id={"textAnswerC".concat(i)}
                                    label="Answer C"
                                    variant="outlined"
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
                                  component="form"
                                  sx={{
                                    marginLeft: "-4px",
                                    marginRight: "-4px",
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    className="textAnswer"
                                    id={"textAnswerD".concat(i)}
                                    label="Answer D"
                                    variant="outlined"
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
                                marginTop: "2em",
                              }}
                            >
                              <span>Question {i + 1}</span>
                              <Button
                                variant="outlined"
                                style={{
                                  float: "right",
                                }}
                                startIcon={<DeleteIcon />}
                                onClick={() => {
                                  removeQuestionAndAnswerFromQuestionList(i);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                            <RichTextInput
                              id={"questionText".concat(i)}
                              key={i}
                              source=""
                              editorOptions={MyEditorOptions}
                              toolbar={
                                <MyRichTextInputToolbar size="medium" idx={i} />
                              }
                              defaultValue={questionList[i].questionText}
                              className="RichTextContentEdit"
                            />
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
                                defaultValue={questionList[i].answerOptions}
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
        </Grid>
        <Grid item xs={0} sm={4} md={3} lg={2} style={{ paddingTop: "64px" }}>
          <Aside />
        </Grid>
      </Grid>
    </Container>
  );
}
