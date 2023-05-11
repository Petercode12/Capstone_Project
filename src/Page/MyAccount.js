import * as React from "react";
import {
  List,
  Datagrid,
  Create,
  SimpleForm,
  DateField,
  TextField,
  EditButton,
  TextInput,
  BooleanField,
  NumberField,
  NumberInput,
  BooleanInput,
  ImageInput,
  ImageField,
  useCreate,
  useNotify,
  useRedirect,
  useGetIdentity,
  ReferenceInput,
  SelectInput,
  AutocompleteArrayInput,
  Toolbar,
  SaveButton,
  required,
  ListContextProvider,
  useGetList,
  useList,
} from "react-admin";
import {
  Box,
  Container,
  Grid,
  createTheme,
  TextField as TextField1,
  InputAdornment,
  FormControl,
  FilledInput,
  InputLabel,
  FormHelperText,
  TablePagination,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  Paper,
  TableRow,
  styled,
  tableCellClasses,
  TableSortLabel,
  FormControlLabel,
  Switch,
  Typography,
  Button,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/MyAccount.css";
import axios from "axios";
import userBanner from "../Images/user_banner.png";
import userIcon from "../Images/user_icon5.png";
// import userIcon from "../Images/user_icon1.png";
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
Number.prototype.padLeft = function(base, chr) {
  var len = String(base || 10).length - String(this).length + 1;
  return len > 0 ? new Array(len).join(chr || "0") + this : this;
};
const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    minWidth: 150,
    maxWidth: 240,
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    type: "dateTime",
    label: "Date",
    minWidth: 120,
    maxWidth: 120,
  },
  {
    id: "score",
    numeric: true,
    disablePadding: false,
    label: "Score",
    minWidth: 80,
    maxWidth: 80,
  },
  {
    id: "time",
    numeric: true,
    disablePadding: false,
    label: "Time taken",
    minWidth: 100,
    maxWidth: 100,
  },
  {
    id: "viewresult",
    numeric: true,
    disablePadding: false,
    label: "View",
    minWidth: 80,
    maxWidth: 80,
  },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#fff",
    color: theme.palette.common.black,
    fontSize: 15,
    fontWeight: "500",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// let Order = "asc" | "desc";
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function hmsToSeconds(t) {
  const [hours, minutes, seconds] = t.split(":");
  return Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds);
}

function secondsToHMS(secs) {
  return new Date(secs * 1000).toISOString().substr(11, 8);
}
function convertQueryDataToQuestionList(data) {
  let questionList = [];

  for (let e of data) {
    let start = e.Start_time;
    let end = e.End_time;
    let diff = secondsToHMS(hmsToSeconds(end) - hmsToSeconds(start));

    var d = new Date(Date.parse(e.Date));
    // var d = Date.parse(e.Date);
    var dformat =
      [
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft(),
        d.getFullYear(),
      ].join("/") +
      " " +
      [
        d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft(),
      ].join(":") +
      (d.getHours() >= 12 ? " PM" : " AM");
    console.log(d, d.getHours());
    let k = {
      id: e.id,
      name: e.Name,
      score: e.Score,
      date: dformat, //new Date(Date.parse("2012-01-26T13:51:50.417-07:00")),
      time: diff,
      viewresult: "View",
    };
    questionList.push(k);
  }
  // console.log("Question List: ", questionList);
  return questionList;
}

function EnhancedTableHead(props) {
  const { order, orderBy, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ maxWidth: headCell.maxWidth }}
          >
            {headCell.id !== "viewresult" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                style={{ pointerEvents: "none" }}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
export const MyAccount = () => {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );
  const [questionList, setQuestionList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("date");
  const [dense, setDense] = useState(false);
  const isSelected = (name) => selected.indexOf(name) !== -1;
  let emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - questionList.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  useEffect(() => {
    console.log(userInfo.id);
    axios
      .get("http://localhost:8000/my_account/tests/".concat(userInfo.id))
      .then((res) => {
        setQuestionList(convertQueryDataToQuestionList(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userInfo]);
  return (
    <Container
      xs={{ maxWidth: 768 }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "30px",
      }}
    >
      <div className="sm-container">
        <div className="profile-cover">
          <div className="profile-cover-img-wrapper">
            <img
              className="profile-cover-img"
              src={
                userInfo
                  ? userInfo.Banner !== ""
                    ? userInfo.Banner
                    : userBanner
                  : userBanner
              }
              alt={userInfo ? userInfo.fullName + "-cover" : "user-cover"}
            />
          </div>
        </div>
        <div className="mx-md-auto mb-3 text-center">
          <div className="profile-cover-avatar">
            <img
              className="avatar-img"
              src={
                userInfo
                  ? userInfo.Avatar !== ""
                    ? userInfo.Avatar
                    : userIcon
                  : userIcon
              }
              alt={userInfo ? userInfo.Username : "user"}
            />
            <a
              className="avatar-button text-dark"
              href="/app/my_account/settings/"
            >
              <i className="avatar-icon fa fa-pencil" />
            </a>
          </div>

          <h1
            className="h3 profile-header-title"
            id={
              userInfo ? userInfo.Username + "-public-page" : "user-public-page"
            }
          >
            {userInfo ? userInfo.Username : "Guest"}{" "}
          </h1>

          <div className="profile-header-content">
            <p />
          </div>
        </div>
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <a className="nav-link active" href="/app/my_account/tests/">
              Exam results
            </a>
            <a className="nav-link" href="/app/my_account/tests/created/">
              Exam created management
            </a>
          </li>
        </ul>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "70vh" }}>
            <Table
              sx={{ minWidth: 750 }}
              stickyHeader
              aria-labelledby="user result table"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={questionList.length}
              />
              <TableBody>
                {stableSort(questionList, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => {}}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        // sx={{ cursor: "pointer" }}
                      >
                        <StyledTableCell
                          id={labelId}
                          scope="row"
                          sx={{
                            maxWidth: headCells[0].maxWidth,
                          }}
                        >
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          sx={{
                            padding: 0,
                            maxWidth: headCells[1].maxWidth,
                          }}
                        >
                          {row.date}
                          {/* {new Date(Date.parse(row.date)).toString()} */}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          sx={{
                            maxWidth: headCells[2].maxWidth,
                          }}
                        >
                          {row.score}
                        </StyledTableCell>
                        <StyledTableCell
                          align="right"
                          sx={{
                            maxWidth: headCells[3].maxWidth,
                          }}
                        >
                          {row.time}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            href={"/app/practice_tests/result/" + row.id}
                          >
                            View
                          </Button>
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <StyledTableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={questionList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>
    </Container>
  );
};
