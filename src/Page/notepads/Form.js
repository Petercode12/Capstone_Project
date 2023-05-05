import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
const Form = ({ todos, setTodos }) => {
  const [inputText, setInputText] = useState("");
  const submitTodoHandler = (e) => {
    e.preventDefault();
    const notePadElement = document.getElementById("notePad");
    if (notePadElement !== null) {
      console.log("Note: ", notePadElement.value);
      setTodos([
        ...todos,
        // { text: notePadElement.value, completed: false, id: Math.random() },
        {
          text: inputText,
          completed: false,
          id: Math.random(),
        },
      ]);
    }
    setInputText("");
  };
  const noteChange = (e) => {
    setInputText(e.target.value);
  };
  return (
    <form>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          padding: "8px 0px",
          width: "100%",
        }}
      >
        Todo List
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "0px 4px 0px 8px",
        }}
      >
        <TextField
          id="notePad"
          label="Note"
          variant="filled"
          onChange={noteChange}
          defaultValue={""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitTodoHandler(e);
            }
          }}
          sx={{
            margin: "0px 8px",
          }}
        />
        <IconButton
          onClick={submitTodoHandler}
          // className="todo-button"
          color="primary"
          aria-label="add to shopping cart"
          style={{
            padding: "2px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default Form;
