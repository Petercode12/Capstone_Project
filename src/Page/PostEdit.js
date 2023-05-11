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
import { ToggleButton, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FunctionsIcon from "@mui/icons-material/Functions";
import SettingsIcon from "@mui/icons-material/Settings";
import Remove from "@mui/icons-material/Remove";
import { MathFormulaDialog } from "./MathFormulaDialog";
import { PostEditInfo } from "./PostEditInfo";
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
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { Toolbar, Edit, useCreate, useNotify, TextInput } from "react-admin";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import { Container, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import insertTextAtCursor from "insert-text-at-cursor";
function getBlankAnswersFromQuestion(temp) {
  const regex = /<blank id="[0-9]+">/g;
  const regex2 = /<\/blank>/g;
  const found = [...temp.matchAll(regex)];
  const found2 = [...temp.matchAll(regex2)];
  let list = [];
  for (let i = 0; i < found.length; i++) {
    list.push({
      answerText: temp.substring(
        found[i].index + found[i][0].length,
        found2[i].index
      ),
    });
  }
  return list;
}
function changeBlankAnswersToEllipsis(temp) {
  let list = getBlankAnswersFromQuestion(temp);
  for (let i = 0; i < list.length; i++) {
    console.log("Temp before: ", temp, `<blank id="${i}">${list[i]}</blank>`);
    temp = temp.replace(
      `<blank id="${i}">${list[i].answerText}</blank>`,
      `&lt;blank id="${i}"&gt;...&lt;/blank&gt;`
    );
    console.log("Temp after: ", temp);
  }
  return temp;
}
function convertQueryDataToQuestionList(data) {
  let questionList = [];
  for (let e of data) {
    let k = {};

    let temp = e.Question.replaceAll(
      "<MathJaxContext config={config}><MathJax>`",
      "&lt;Math&gt;"
    );
    temp = temp.replaceAll('<br class="ProseMirror-trailingBreak">', "");
    temp = temp.replaceAll("`</MathJax></MathJaxContext>", "&lt;/Math&gt;");
    if (e.Type === "MCQ") {
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
    } else if (e.Type === "Cons") {
      k = {
        questionText: temp,
        answerOptions: e.Solution,
        type: "Cons",
      };
    } else if (e.Type === "FIB") {
      k = {
        questionText: changeBlankAnswersToEllipsis(temp),
        answerOptions: getBlankAnswersFromQuestion(temp),
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
        questionText: temp,
        type: "Paragraph",
      };
    }
    questionList.push(k);
  }
  console.log("Question List: ", questionList);
  return questionList;
}
function assignBlankAnswersToBlanks(question) {
  let tempAnswerOptions = question.answerOptions;
  for (let i = 0; i < tempAnswerOptions.length; i++) {
    let regex = `&lt;blank id="${i}"&gt;...&lt;/blank&gt;`;
    question.questionText = question.questionText.replace(
      regex,
      `<blank id="${i}">${tempAnswerOptions[i].answerText}</blank>`
    );
  }
  return question.questionText;
}

export function PostEdit() {
  //edit create test
  const [questionList, setQuestionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEditInfo, setOpenEditInfo] = useState(false);
  const [idx, setIdx] = useState();
  const [lastModifiedDateTime, setLastModifiedDateTime] = useState("");
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
        console.log("Data: ", res.data);
        setQuestionList(convertQueryDataToQuestionList(res.data["q_and_a"]));
        setLastModifiedDateTime(res.data["last_modified_date_time"]);
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
  const insertQA_FIB = () => {
    setQuestionList([
      ...questionList,
      {
        questionText: "",
        answerOptions: [],
        type: "FIB",
      },
    ]);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const insertAudio = () => {
    setQuestionList([
      ...questionList,
      { fileName: "", file: "", type: "Audio" },
    ]);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const insertParagraph = () => {
    setQuestionList([...questionList, { questionText: "", type: "Paragraph" }]);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };
  const PostEditToolbar = () => (
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
        <Box sx={{ "& > button": { m: 1 } }}>
          <LoadingButton
            color="primary"
            onClick={() => {
              handleClickOpenDialogEditInfo();
            }}
            loading={false}
            // loadingPosition="start"
            // startIcon={<EditNoteIcon />}
            startIcon={<SettingsIcon />}
            variant="contained"
            className="SettingButton"
          >
            Test Info
          </LoadingButton>
        </Box>
        <PostEditInfo
          open={openEditInfo}
          setOpen={setOpenEditInfo}
          handleCloseDialogEditInfo={handleCloseDialogEditInfo}
          ModifiedDateTime={lastModifiedDateTime}
          updatelastModifiedDateTime={setLastModifiedDateTime}
        />
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
          Type: "MCQ",
          audioName: "",
          audio: "",
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
          Type: "Cons",
          audioName: "",
          audio: "",
          exam_id: params.id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "FIB") {
        let k = {
          Ordinal: i + 1,
          Question: assignBlankAnswersToBlanks(questionList[i]),
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: null,
          Type: "FIB",
          audioName: "",
          audio: "",
          exam_id: params.id,
        };
        saveData.push(k);
      } else if (questionList[i].type === "Audio") {
        let k = {
          Ordinal: i + 1,
          Question: "",
          Answer_a: null,
          Answer_b: null,
          Answer_c: null,
          Answer_d: null,
          Correct_answer: null,
          Solution: null,
          Type: "Audio",
          audioName: questionList[i].fileName,
          audio: questionList[i].file,
          exam_id: params.id,
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
          Type: "Paragraph",
          audioName: "",
          audio: "",
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
      } else if (questionList[i].type === "Cons") {
        handleQuestionTextChange(i);
        handleTextField_ConsChange(i);
      } else if (questionList[i].type === "FIB") {
        handleQuestionTextChange(i);
        handleBlankAnswerChange(i);
      } else if (questionList[i].type === "Paragraph") {
        handleQuestionTextChange(i);
      }
    }
    const dataGen = saveDataGen();
    const data = {
      dataGen: dataGen,
      last_modified_date_time: lastModifiedDateTime,
    };
    console.log("DATA will be saved: ", data);
    // create("save_questions_and_answers/".concat(params.id), { data });
    axios // post  lich sử làm bài và kết quả
      .post(
        "http://localhost:8000/save_questions_and_answers/".concat(params.id),
        data
      )
      .then((res) => {
        console.log("Data: ", res.data, res.data["last_modified_date_time"]);
        notify("Save successfully!", { type: "success" });
        setLastModifiedDateTime(res.data["last_modified_date_time"]);
      })
      .catch((err) => {
        console.log(err, err.response.status === 409);
        if (err.response.status === 409)
          notify("Old version, Please reload the page!", { type: "error" });
        else notify("Cannot save!", { type: "error" });
      });
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
      '<br class="ProseMirror-trailingBreak">',
      ""
    );
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
  const handleBlankAnswerChange = (i) => {
    let newArr = [...questionList];
    let tempAnswerOptions = questionList[i].answerOptions;
    for (let idx = 0; idx < tempAnswerOptions.length; idx++) {
      let blankAnswer_Element = document.getElementById(
        "blankAnswer"
          .concat(idx)
          .concat("in")
          .concat(i)
      );
      newArr[i].answerOptions[idx].answerText = blankAnswer_Element.value;
    }
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
    let newArr = [...questionList]; // Redo: Lấy từ document element
    //
    for (let i = 0; i < newArr.length; i++) {
      if (questionList[i].type === "MCQ") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          newArr[i].questionText = questionTextElement.innerHTML;
        }
        // answerText A
        let textFieldA_Element = document.getElementById(
          "textAnswerA".concat(i)
        );
        if (textFieldA_Element !== null) {
          newArr[i].answerOptions[0].answerText = textFieldA_Element.value;
        }
        // answerText B
        let textFieldB_Element = document.getElementById(
          "textAnswerB".concat(i)
        );
        if (textFieldB_Element !== null) {
          newArr[i].answerOptions[1].answerText = textFieldB_Element.value;
        }
        // answerText C
        let textFieldC_Element = document.getElementById(
          "textAnswerC".concat(i)
        );
        if (textFieldC_Element !== null) {
          newArr[i].answerOptions[2].answerText = textFieldC_Element.value;
        }
        // answerText D
        let textFieldD_Element = document.getElementById(
          "textAnswerD".concat(i)
        );
        if (textFieldD_Element !== null) {
          newArr[i].answerOptions[3].answerText = textFieldD_Element.value;
        }
      } else if (questionList[i].type === "Cons") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          newArr[i].questionText = questionTextElement.innerHTML;
        }
        // textField
        let textFieldElement = document.getElementById(
          "textAnswerCons".concat(i)
        );
        if (textFieldElement !== null) {
          newArr[i].answerOptions = textFieldElement.value;
        }
      } else if (questionList[i].type === "FIB") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          newArr[i].questionText = questionTextElement.innerHTML;
        }
        // blank answers
        for (let idx = 0; idx < questionList[i].answerOptions.length; idx++) {
          let blankAnswer_Element = document.getElementById(
            "blankAnswer"
              .concat(idx)
              .concat("in")
              .concat(i)
          );
          if (blankAnswer_Element !== null) {
            newArr[i].answerOptions[idx].answerText = blankAnswer_Element.value;
          }
        }
      } else if (questionList[i].type === "Paragraph") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          newArr[i].questionText = questionTextElement.innerHTML;
        }
      }
    }
    //
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
      } else if (questionList[i].type === "Cons") {
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
      } else if (questionList[i].type === "FIB") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          questionTextElement.innerHTML = questionList[i].questionText;
        }
        // blank answers
        for (let idx = 0; idx < questionList[i].answerOptions.length; idx++) {
          let blankAnswer_Element = document.getElementById(
            "blankAnswer"
              .concat(idx)
              .concat("in")
              .concat(i)
          );
          if (blankAnswer_Element !== null) {
            blankAnswer_Element.value =
              questionList[i].answerOptions[idx].answerText;
          }
        }
      } else if (questionList[i].type === "Paragraph") {
        // questionText
        let questionTextElement = document.getElementById(
          "questionText".concat(i)
        );
        if (questionTextElement !== null) {
          questionTextElement.innerHTML = questionList[i].questionText;
        }
      }
    }
  };
  if (assignNewValueForElementsCheck) {
    assignNewValueForElements();
    setAssignNewValueForElementsCheck(false);
  }
  const MyEditorOptions = {
    ...DefaultEditorOptions,
    // extensions: [...DefaultEditorOptions.extensions, HorizontalRule],
  };

  const handleClickOpenDialog = (idx) => {
    setIdx(idx);
    setOpen(true);
  };
  const handleCloseDialog = (eq, reason) => {
    if (reason && reason === "backdropClick" && "escapeKeyDown") return;
    if (eq !== null && eq !== "") {
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
  const handleClickOpenDialogEditInfo = () => {
    setOpenEditInfo(true);
  };
  const handleCloseDialogEditInfo = (eq, reason) => {
    if (reason && reason === "backdropClick" && "escapeKeyDown") {
      setOpenEditInfo(false);
      return;
    }
    // gửi lệnh patch
    if (eq !== null && eq !== "") {
      let questionTextElement = document.getElementById(
        "questionText".concat(idx)
      );
      questionTextElement.innerHTML += `<p>&lt;Math&gt;${eq.substring(
        1,
        eq.length - 1
      )}&lt;/Math&gt</p>`;
    }
    setOpenEditInfo(false);
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
  const CustomRichTextInputToolbar = (...props) => {
    return <RichTextInputToolbar {...props} style={{ display: "none" }} />;
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const getFileName = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.fileName = file.name;
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.fileName);
      reader.onerror = (error) => reject(error);
    });
  async function audioToBase64(e, i) {
    let tempQuestionList = questionList;
    tempQuestionList[i].file = await toBase64(e.target.files[0]);
    tempQuestionList[i].fileName = await getFileName(e.target.files[0]);
    setQuestionList([...tempQuestionList]);
  }
  const handleAddBlank = (i) => {
    let tempQuestionList = questionList;
    tempQuestionList[i].answerOptions.push({ answerText: "" });
    const el = document.getElementById("questionText".concat(i));
    insertTextAtCursor(
      el,
      `<blank id="${tempQuestionList[i].answerOptions.length - 1}">...</blank>`
    );
    setQuestionList([...tempQuestionList]);
  };
  // console.log("Question list: ", questionList);
  return (
    <Container sx={{ maxWidth: { xl: 1280 } }}>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={12}>
          <div className="InsertButton">
            <Button
              variant="contained"
              onClick={insertQA_MCQ}
              className="InsertMCQButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Multiple Choice
            </Button>
            <Button
              variant="contained"
              onClick={insertQA_Cons}
              className="InsertConsButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Constructive
            </Button>
            <Button
              variant="contained"
              onClick={insertQA_FIB}
              className="InsertFIBButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Fill in Blank
            </Button>
            <Button
              variant="contained"
              onClick={insertAudio}
              className="InsertAudioFile"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Audio
            </Button>
            <Button
              variant="contained"
              onClick={insertParagraph}
              className="InsertParagraphButton"
              mr={{ xs: 0, sm: "0.5em" }}
            >
              <i className="bi bi-plus" /> Paragraph
            </Button>
          </div>
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
                        let calculatedIndex = calculateIndexMinusNumOfAudio(i);
                        return (
                          <div key={i}>
                            <div
                              className="question-count"
                              style={{
                                margin: "1em 0em",
                              }}
                              id={"question".concat(calculatedIndex)}
                            >
                              <span>Question {calculatedIndex}</span>
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
                                  sx={{ margin: 0 }}
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
                                  sx={{ margin: 0 }}
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
                                  sx={{ margin: 0 }}
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
                                  sx={{ margin: 0 }}
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
                      } else if (question.type === "Cons") {
                        let calculatedIndex = calculateIndexMinusNumOfAudio(i);
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
                      } else if (question.type === "FIB") {
                        let calculatedIndex = calculateIndexMinusNumOfAudio(i);
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
                            <IconButton
                              aria-label="addAnswer"
                              color="primary"
                              onClick={() => handleAddBlank(i)}
                            >
                              <AddIcon />
                            </IconButton>
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
                                      question.answerOptions[idx].answerText
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
                              alignContent: "space-between",
                              justifyContent: "space-between",
                              rowGap: "0.5rem",
                            }}
                          >
                            <Typography variant="h5">Upload audio: </Typography>
                            <span
                              style={{
                                display: "flex",
                                flex: 1,
                              }}
                            />
                            <Button
                              variant="outlined"
                              style={{
                                display: "flex",
                                // float: "right",
                                marginLeft: "1em",
                              }}
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                removeQuestionAndAnswerFromQuestionList(i);
                              }}
                            >
                              Delete
                            </Button>
                            <div className="break" />
                            <Button
                              color="secondary"
                              size="small"
                              variant="contained"
                              component="label"
                              sx={{ height: "36.5px" }}
                            >
                              Choose file
                              <input
                                id="audioFile"
                                type="file"
                                name="audio"
                                hidden
                                multiple
                                onChange={(event) => {
                                  audioToBase64(event, i);
                                }}
                              />
                            </Button>
                            <span
                              style={{
                                marginLeft: "0.8em",
                                color: "#fb8500",
                              }}
                            >
                              {questionList[i].fileName}
                            </span>
                            {questionList[i].file !== "" ? (
                              <audio
                                src={questionList[i].file}
                                controls
                                style={{
                                  height: "40px",
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        );
                      } else if (question.type === "Paragraph") {
                        return (
                          <div key={i} style={{ marginTop: "2em" }}>
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
                            <RichTextInput
                              id={"questionText".concat(i)}
                              key={i}
                              toolbar={<CustomRichTextInputToolbar />}
                              source=""
                              defaultValue={questionList[i].questionText}
                              className="RichTextContentEdit"
                            />
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
