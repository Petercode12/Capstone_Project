import insertTextAtCursor from "insert-text-at-cursor";
import React, { createRef } from "react";
import { SimpleForm } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import "../Style/Test.css";
export const Test = () => {
  return (
    <>
      <div className="content-container">
        <section className="header-section">
          <div className="bg" />
          <div class="container">
            <div class="text">
              <h1>Your digital insurance protection abroad</h1>
              International health and travel insurance for expats, travelers,
              and students.
              <a href="/en/wizard" class="btn">
                Let's start
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
