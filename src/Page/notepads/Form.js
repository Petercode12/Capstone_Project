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
          minWidth: "170px",
        }}
      >
        Todo List
      </div>
      <TextField
        id="notePad"
        label="Note"
        rows={5}
        variant="filled"
        style={{
          width: "60%",
        }}
        onChange={noteChange}
        defaultValue={""}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitTodoHandler(e);
          }
        }}
      />
      <IconButton
        onClick={submitTodoHandler}
        className="todo-button"
        color="primary"
        aria-label="add to shopping cart"
        style={{
          marginTop: "12px",
          marginLeft: "5px",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <AddCircleOutlineIcon />
      </IconButton>
    </form>
  );
};

export default Form;
