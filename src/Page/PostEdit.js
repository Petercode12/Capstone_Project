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
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";

export function PostEdit() {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }
  const insertQA_MCQ = () => {
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
  //
  const addNavigationMenu = () => {
    console.log("Question list length: ", questionList.length);
    let buttonGroupList = [];
    let buttonList = [];
    if (questionList.length < 4) {
      for (let i = 1; i <= questionList.length; i++) {
        buttonList.push(<Button>{i}</Button>);
      }
      buttonGroupList.push(
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          {buttonList}
        </ButtonGroup>
      );
    } else {
      for (let i = 1; i <= questionList.length; i++) {
        if (i % 4 !== 0) {
          buttonList.push(<Button size="small">{i}</Button>);
        } else {
          buttonList.push(<Button size="small">{i}</Button>);
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
    console.log("This is buttonGroupList: ", buttonGroupList);
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
            {/* <ButtonGroup variant="outlined" aria-label="outlined button group">
              {questionList.map((question, i) => {
                return <Button>{i + 1}</Button>;
              })}
            </ButtonGroup> */}
            {addNavigationMenu()}
          </Box>
        </Paper>
      </Box>
    </div>
  );
  //
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
            // bottom: "40em",
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
          {/* <div collapseOnSelect expand="lg">
          <div className="navigation">
            <Row>
              <div className="InsertButton" style={{ padding: 0 }}>
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
            </Row>
          </div>
        </div> */}
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
                        >
                          <span>Question {i + 1}</span>
                        </div>
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
                              defaultValue={
                                question.answerOptions[0].answerText
                              }
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
                              defaultValue={
                                question.answerOptions[1].answerText
                              }
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
                              defaultValue={
                                question.answerOptions[2].answerText
                              }
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
                              defaultValue={
                                question.answerOptions[3].answerText
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
                          className="question-count"
                          style={{ marginTop: "2em" }}
                        >
                          <span>Question {i + 1}</span>
                        </div>
                        <RichTextInput source="" />
                        <div>
                          <TextField
                            id="filled-multiline-static"
                            label="Answer"
                            multiline
                            rows={5}
                            variant="filled"
                            style={{ width: "55em" }}
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
