import React, { useState } from "react";
import "../Style/PostEditStyle.css";
import { Row } from "react-bootstrap";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { SimpleForm } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import { Toolbar, Edit } from "react-admin";

export function PostEdit() {
  const [questionList, setQuestionList] = useState([
    {
      questionText: "What is the capital of France?",
      answerOptions: [
        { answerText: "New York", isCorrect: false },
        { answerText: "London", isCorrect: false },
        { answerText: "Paris", isCorrect: true },
        { answerText: "Dublin", isCorrect: false },
      ],
    },
    {
      questionText: "Who is CEO of Tesla?",
      answerOptions: [
        { answerText: "Jeff Bezos", isCorrect: false },
        { answerText: "Elon Musk", isCorrect: true },
        { answerText: "Bill Gates", isCorrect: false },
        { answerText: "Tony Stark", isCorrect: false },
      ],
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }
  const insertQA = () => {
    setQuestionList([
      ...questionList,
      {
        questionText: "",
        answerOptions: [
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
          { answerText: "", isCorrect: false },
        ],
      },
    ]);
  };
  const PostEditToolbar = () => (
    <Toolbar>
      <Box sx={{ "& > button": { m: 1 } }}>
        <LoadingButton
          color="secondary"
          onClick={handleClick}
          loading={loading}
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
  return (
    <Edit title="Edit exam">
      <SimpleForm toolbar={<PostEditToolbar />}>
        <div collapseOnSelect expand="lg">
          <div className="navigation">
            <Row>
              <div style={{ padding: 0 }}>
                <Button
                  variant="contained"
                  onClick={insertQA}
                  className="InsertMCQButton"
                >
                  <i className="bi bi-plus"></i> Insert MCQ
                </Button>
              </div>
            </Row>
          </div>
        </div>
        <div className="multipleChoice">
          <div className="question-section">
            <div className="question-text">
              {questionList.map((question, i) => {
                return (
                  <div key={i}>
                    <div
                      className="question-count"
                      style={{ marginTop: "2em" }}
                    >
                      <span>Question {i + 1}</span>
                    </div>
                    {/* <TextareaAutosize
                    aria-label="empty textarea"
                    placeholder="Question"
                    style={{ width: "59em", height: 100 }}
                    defaultValue={question.questionText}
                  /> */}
                    <RichTextInput source="" />
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      style={{ marginTop: "1em" }}
                    >
                      <FormControlLabel
                        value="female"
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
                          id="outlined-basic"
                          label="Answer A"
                          variant="outlined"
                          defaultValue={question.answerOptions[0].answerText}
                        />
                      </Box>
                      <FormControlLabel
                        value="male"
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
                          id="outlined-basic"
                          label="Answer B"
                          variant="outlined"
                          defaultValue={question.answerOptions[1].answerText}
                        />
                      </Box>
                      <FormControlLabel
                        value="other1"
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
                          id="outlined-basic"
                          label="Answer C"
                          variant="outlined"
                          defaultValue={question.answerOptions[2].answerText}
                        />
                      </Box>
                      <FormControlLabel
                        value="other2"
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
                          id="outlined-basic"
                          label="Answer D"
                          variant="outlined"
                          defaultValue={question.answerOptions[3].answerText}
                        />
                      </Box>
                    </RadioGroup>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SimpleForm>
    </Edit>
  );
}
