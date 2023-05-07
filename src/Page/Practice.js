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
  Grid,
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
import { useGetIdentity, useRedirect } from "react-admin";
import "../Style/TestPoolStyle.css";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

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
const tags = [
  "Math",
  "English",
  "Geography",
  "Physics",
  "Calculus",
  "IELTS",
  "Others",
];
const Root = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  "& > :not(style) + :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
export function PracticeList() {
  const [originalExamList, setOriginalExamList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [tagName, setTagName] = useState([]);
  const [indexTagName, setIndexTagName] = useState([]);
  const [examTagList, setExamTagList] = useState([]);
  let infinity = "♾️";
  const { data: userInfo, isLoading, error } = useGetIdentity();
  const redirect = useRedirect();
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
        console.log("Exam list: ", res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userInfo]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/query_exam_tags/")
      .then((res) => {
        let temp = [];
        for (let e of res.data) {
          temp.push({ examId: e.exam_id, tag: e.tag });
        }
        setExamTagList(temp);
        let searchBarElementValue = document.getElementById("search").value;
        if (indexTagName.length === 0) {
          if (searchBarElementValue !== "") {
            const filteredExamList = originalExamList.filter((e) => {
              return e.Name.toLowerCase().includes(
                searchBarElementValue.toLowerCase()
              );
            });
            setExamList(filteredExamList);
          } else {
            if (originalExamList.length !== 0) {
              setExamList(originalExamList);
            }
          }
        } else {
          let tempExamList = [];
          for (let e of temp) {
            if (indexTagName.includes(e.tag)) {
              tempExamList.push(e.examId);
            }
          }
          setExamList(
            originalExamList.filter((exam) => {
              return (
                exam.Name.toLowerCase().includes(
                  searchBarElementValue.toLowerCase()
                ) && tempExamList.includes(exam.id)
              );
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [indexTagName]);

  const handleSearchChange = (event) => {
    if (indexTagName.length === 0) {
      const filteredExamList = originalExamList.filter((e) => {
        return e.Name.toLowerCase().includes(event.target.value.toLowerCase());
      });
      setExamList(filteredExamList);
    } else {
      let tempExamList = [];
      for (let e of examTagList) {
        if (indexTagName.includes(e.tag)) {
          tempExamList.push(e.examId);
        }
      }
      const filteredExamList = originalExamList.filter((e) => {
        return (
          e.Name.toLowerCase().includes(event.target.value.toLowerCase()) &&
          tempExamList.includes(e.id)
        );
      });
      setExamList(filteredExamList);
    }
  };
  const handleTagFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setTagName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    let indexTagList = [];
    for (let e of value) {
      indexTagList.push(tags.indexOf(e));
    }
    setIndexTagName(indexTagList);
  };
  return (
    <>
      <Container
        sx={{
          marginTop: "1.25em",
          marginBottom: "1.25em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={8}>
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
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl sx={{ width: "100%", marginTop: 0 }}>
              <InputLabel
                id="demo-multiple-checkbox-label"
                style={{
                  top: "-12px",
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
          </Grid>
        </Grid>
      </Container>
      <Root>
        <Divider style={{ marginBottom: "1em" }}>
          <Chip style={{ fontSize: "14px" }} label="MY TEST" />
        </Divider>
      </Root>
      <div spacing={2} className="GridContainer">
        {examList
          .filter((exam) => {
            return exam.User_id === userInfo["id"];
          })
          .map((exam, i) => {
            if (exam["description"] === "") {
              exam["description"] = "No description";
            }
            if (exam["duration"] === 0) {
              exam["duration"] = infinity;
            }
            return (
              <div item="true" key={i} className="GridPaper">
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
                      inline="true"
                      color="text.secondary"
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
                    <Button
                      size="small"
                      onClick={() => {
                        redirect(window.location.href + "/" + exam["id"]);
                      }}
                    >
                      Practice
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })}
      </div>
      <Root>
        <Divider style={{ marginBottom: "1em", marginTop: "1em" }}>
          <Chip style={{ fontSize: "14px" }} label="SHARED TEST" />
        </Divider>
      </Root>
      <div spacing={2} className="GridContainer">
        {examList
          .filter((exam) => {
            return exam.User_id !== userInfo["id"];
          })
          .map((exam, i) => {
            if (exam["description"] === "") {
              exam["description"] = "No description";
            }
            if (exam["duration"] === 0) {
              exam["duration"] = infinity;
            }
            return (
              <div item="true" key={i} className="GridPaper">
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
                      inline="true"
                      color="text.secondary"
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
                    <Button
                      size="small"
                      onClick={() => {
                        redirect(window.location.href + "/" + exam["id"]);
                      }}
                    >
                      Practice
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })}
      </div>
    </>
  );
}
