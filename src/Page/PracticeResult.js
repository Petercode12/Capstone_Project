import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import {
  SimpleForm,
  SaveButton,
  Toolbar,
  Edit,
  useCreate,
  useNotify,
  useGetRecordId,
  useGetIdentity,
} from "react-admin";
import { RichTextInput, RichTextInputToolbar } from "ra-input-rich-text";
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
  Card,
  CardMedia,
  CardContent,
  CardActions,
  InputAdornment,
} from "@mui/material";
import "../Style/PracticeResult.css";
import SearchIcon from "@mui/icons-material/Search";

export function PracticeResult() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [examList, setExamList] = useState([]);
  let infinity = "♾️";
  const { data: userInfo, isLoading, error } = useGetIdentity();
  console.log("UserInfo: ", userInfo);
  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/exams/".concat(
          userInfo !== undefined ? userInfo["id"] : 0
        )
      )
      .then((res) => {
        console.log("Data: ", res.data);
        setOriginalExamList(res.data);
        setExamList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userInfo]);
  const handleSearchChange = (event) => {
    const filteredExamList = originalExamList.filter((e) => {
      return e.Name.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setExamList(filteredExamList);
  };
  return (
    <>
      <Container
        sx={{
          marginTop: "2em",
          marginBottom: "2em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          id="search"
          type="search"
          label="Search"
          onChange={handleSearchChange}
          sx={{ width: "100%", maxWidth: "1000px" }}
          style={{ backgroundColor: "#fff" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Container>

      <div
        // container
        spacing={2}
        className="GridContainer"
      >
        {examList.map((exam, i) => {
          if (exam["description"] === "") {
            exam["description"] = "No description";
          }
          if (exam["duration"] === 0) {
            exam["duration"] = infinity;
          }
          return (
            <div item key={i} className="GridPaper">
              <Card
                sx={{
                  width: 340,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
                className="NavigationAsidePaper"
              >
                <CardMedia
                  component="img"
                  alt="exam paper"
                  height="140"
                  image={exam["image"]}
                />
                <CardContent sx={{ padding: "0px 12px" }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    noWrap
                    sx={{ margin: "4px 0px" }}
                  >
                    {exam["Name"]}
                  </Typography>
                  <Typography
                    variant="body1"
                    inline
                    color="text.secondary"
                    InputProps={{
                      readOnly: true,
                    }}
                    noWrap
                    sx={{
                      marginBottom: "2px",
                      marginLeft: "2px",
                    }}
                  >
                    {exam["description"]}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <div
                      style={{
                        transform: "translateY(1px)",
                        display: "inline-block",
                      }}
                    >
                      <i
                        className="fa-regular fa-clock"
                        style={{
                          fontSize: "20px",
                          marginRight: ".4rem",
                          marginTop: ".4rem",
                        }}
                        sx={{ margin: "0px 4px" }}
                      />
                    </div>
                    {exam["duration"]} min
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                  <Button size="small">Practice</Button>
                </CardActions>
              </Card>
            </div>
          );
        })}
      </div>
    </>
  );
}
