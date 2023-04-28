import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const Todo = ({ text, todos, todo, setTodos }) => {
  const deleteHandler = () => {
    setTodos(todos.filter((el) => el.id !== todo.id));
  };
  const completeHandler = () => {
    setTodos(
      todos.map((item) => {
        if (item.id === todo.id) {
          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      })
    );
  };
  return (
    <div className="todo">
      <li
        style={{ fontSize: "16px" }}
        className={`todo-item ${todo.completed ? "completed" : ""}`}
      >
        {text}
      </li>
      <IconButton
        color="success"
        style={{ padding: "2px" }}
        onClick={completeHandler}
      >
        <CheckCircleOutlineOutlinedIcon />
      </IconButton>
      <IconButton
        onClick={deleteHandler}
        style={{ padding: "2px" }}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default Todo;
