import * as React from "react";
import Button from "@mui/material/Button";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Container,
  InputAdornment,
  TextField,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { useGetIdentity } from "react-admin";
import "../Style/TestPoolStyle.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 15;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const tags = ["Math", "English", "Geography", "Physics", "Calculus", "IELTS"];

export function TestPool() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [tagName, setTagName] = useState([]);
  let infinity = "♾️";
  const { data: userInfo, isLoading, error } = useGetIdentity();

  useEffect(() => {
    axios
      .get(
        "http://localhost:8000/exams/".concat(
          userInfo !== undefined ? userInfo["id"] : 0
        )
      )
      .then((res) => {
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
  const handleTagFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  console.log("tagName: ", tagName);
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
        <div>
          <FormControl sx={{ m: 1, width: 300, bottom: "-3px" }}>
            <InputLabel
              id="demo-multiple-checkbox-label"
              style={{
                top: "-12px",
                // transform: "translate(12px, 20px) scale(1)",
              }}
              className="labelTagFilter"
            >
              Tag
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={tagName}
              onChange={handleTagFilterChange}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              style={{ verticalAlign: "middle", height: "48px" }}
            >
              {tags.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={tagName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Container>
      <div spacing={2} className="GridContainer">
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
