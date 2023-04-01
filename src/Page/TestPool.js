import * as React from "react";
import Button from "@mui/material/Button";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Container, InputAdornment, TextField } from "@mui/material";
import { useGetIdentity } from "react-admin";

export function TestPool() {
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
        maxWidth="sm"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      >
        <TextField
          id="search"
          type="search"
          label="Search"
          onChange={handleSearchChange}
          sx={{ width: "100%" }}
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

      <Grid
        container
        spacing={2}
        sx={{ maxWidth: 1280, display: "flex", marginTop: "1em" }}
      >
        {examList.map((exam, i) => {
          if (exam["description"] === "") {
            exam["description"] = "No description";
          }
          if (exam["duration"] === 0) {
            exam["duration"] = infinity;
          }
          return (
            <Grid xs={12} sm={6} md={4} lg={3} xl={2} item key={i}>
              <Card
                sx={{
                  maxWidth: 340,
                  justifyContent: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <CardMedia
                  component="img"
                  alt="exam paper"
                  height="140"
                  image={exam["image"]}
                />
                <CardContent style={{ marginTop: 4, paddingBottom: 0 }}>
                  <Typography gutterBottom variant="h5" component="div" noWrap>
                    {exam["Name"]}
                  </Typography>
                  <Typography
                    variant="body1"
                    inline
                    color="text.secondary"
                    noWrap
                  >
                    {exam["description"]}
                  </Typography>
                  <Typography variant="subtitle1" component="div">
                    <i
                      className="fa fa-clock-o"
                      style={{
                        fontSize: "20px",
                        marginRight: ".4rem",
                        marginTop: ".4rem",
                      }}
                    />
                    {exam["duration"]} min
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Edit</Button>
                  <Button size="small">Practice</Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
