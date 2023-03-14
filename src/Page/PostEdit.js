import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Style/PostEditStyle.css";
import { Row } from "react-bootstrap";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { SaveButton, SimpleForm } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import { Toolbar, Edit, useCreate, useNotify } from "react-admin";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";

function convertQueryDataToQuestionList(data) {
  let questionList = [];
  for (let e of data) {
    let k = {};
    if (e.Is_MCQ) {
      k = {
        questionText: e.Question,
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
        questionText: e.Question,
        answerOptions: e.Solution,
        type: "Cons",
      };
    }
    questionList.push(k);
  }
  return questionList;
}

export function PostEdit() {
  const [questionList, setQuestionList] = useState([]);
  const [create, { error }] = useCreate();
  const notify = useNotify();
  const params = useParams();

  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/query_questions_and_answers_by_examid/".concat(
          params.id
        )
      )
      .then((res) => {
        setQuestionList(convertQueryDataToQuestionList(res.data));
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
    window.scrollTo(0, document.body.scrollHeight);
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
    window.scrollTo(0, document.body.scrollHeight);
  };
  const PostEditToolbar = () => (
    <Toolbar>
      <Box sx={{ "& > button": { m: 1 } }}>
        <LoadingButton
          color="secondary"
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
    <div style={{ width: 200, margin: "0.5em" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            marginTop: 2,
            width: 220,
            height: "auto",
            position: "fixed",
            top: "14.5%",
            zIndex: "10 !important",
          },
        }}
      >
        <Paper>
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            Question List
          </p>
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
    </div>
  );

  const saveDataGen = () => {
    let saveData = [];
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
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            marginTop: 2,
            width: 490,
            height: 50,
            position: "fixed",
            bottom: "85%",
            zIndex: "10 !important",
          },
        }}
      >
        <Paper>
          <div className="InsertButton">
            <Button
              variant="contained"
              onClick={insertQA_MCQ}
              className="InsertMCQButton"
            >
              <i className="bi bi-plus"></i> Insert MCQ
            </Button>
            <Button
              variant="contained"
              onClick={insertQA_Cons}
              className="InsertConsButton"
            >
              <i className="bi bi-plus"></i> Insert Constructive Questions
            </Button>
          </div>
        </Paper>
      </Box>
      <Edit aside={<Aside />} title="Edit exam" style={{ marginTop: "5%" }}>
        <SimpleForm toolbar={<PostEditToolbar />} className="SimpleFormHere">
          <div className="multipleChoice">
            <div className="question-section">
              <div className="question-text">
                {questionList.map((question, i) => {
                  if (question.type === "MCQ") {
                    return (
                      <div key={i}>
                        <div
                          className="question-count"
                          style={{ marginTop: "2em" }}
                          id={"question".concat(i + 1)}
                        >
                          <span>Question {i + 1}</span>
                        </div>
                        <RichTextInput
                          id={"questionText".concat(i)}
                          source=""
                          defaultValue={questionList[i].questionText}
                        />
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          style={{ marginTop: "1em" }}
                          onChange={(event) => {
                            handleMCQChange(event, i);
                          }}
                          defaultValue={questionList[i].correctAnswer}
                        >
                          <FormControlLabel
                            value="A"
                            control={<Radio />}
                            label=""
                          />
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
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
                                questionList[i].answerOptions[0].answerText
                              }
                            />
                          </Box>
                          <FormControlLabel
                            value="B"
                            control={<Radio />}
                            label=""
                          />
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
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
                                questionList[i].answerOptions[1].answerText
                              }
                            />
                          </Box>
                          <FormControlLabel
                            value="C"
                            control={<Radio />}
                            label=""
                          />
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
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
                                questionList[i].answerOptions[2].answerText
                              }
                            />
                          </Box>
                          <FormControlLabel
                            value="D"
                            control={<Radio />}
                            label=""
                          />
                          <Box
                            component="form"
                            sx={{
                              "& > :not(style)": { m: 1, width: "25ch" },
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
                                questionList[i].answerOptions[3].answerText
                              }
                            />
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
                          style={{ marginTop: "2em" }}
                        >
                          <span>Question {i + 1}</span>
                        </div>
                        <RichTextInput
                          id={"questionText".concat(i)}
                          source=""
                          defaultValue={questionList[i].questionText}
                        />
                        <div>
                          <TextField
                            id={"textAnswerCons".concat(i)}
                            label="Answer"
                            multiline
                            rows={5}
                            variant="filled"
                            style={{ width: "55em" }}
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
    </>
  );
}
