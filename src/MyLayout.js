import * as React from "react";
import { useEffect } from "react";
import {
  Tabs,
  Tab,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
  Toolbar,
  AppBar as AppBar1,
  Box,
  Container,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import { withStyles } from "@material-ui/core/styles";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import "./Style/MyLayout.css";
import {
  Menu,
  Sidebar,
  UserMenu,
  useSidebarState,
  Button,
  EditButton,
  Logout,
  LoadingIndicator,
  AppBar,
  useGetIdentity,
  useUserMenu,
} from "react-admin";
import logo from "./Images/logo.jpg";
import logo2 from "./Images/logo2.png";
import { Link, matchPath, useLocation } from "react-router-dom";
const styles = {
  title: {
    // flex: 1,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    width: "150px",
  },
  spacer: {
    flex: 1,
  },
  logo: {
    width: "auto",
    height: "48px",
    // marginRight: "1em",
  },
  logo1: {
    display: "flex",
    justifyContent: "center",
    height: "48px !important",
  },
  label: {
    fontSize: "16px !important",
  },
};
const Root = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
  position: "relative",
}));

const AppFrame = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  overflowX: "auto",
}));

const ContentWithSidebar = styled("main")(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
}));

const Content = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 2,
  padding: theme.spacing(3),
  paddingTop: 0,
  paddingLeft: 5,
  paddingRight: 10,
  marginTop: "48px",
}));

const ProfileMenu = () => {
  const { onClose } = useUserMenu();
  return (
    <MenuItem
      component={Link}
      to="/app/my_account/tests/"
      onClick={onClose}
      sx={{ minWidth: "130px" }}
    >
      <ListItemIcon>
        <PermIdentityIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Profile</ListItemText>
    </MenuItem>
  );
};

const MyLayout = ({ children, dashboard, title, classes, ...props }) => {
  const [open] = useSidebarState();
  const theme = useTheme();
  const isLargeEnough = useMediaQuery(theme.breakpoints.up("sm"));
  const location = useLocation();
  let data = JSON.parse(localStorage.getItem("auth"));
  let userInfo = {
    id: data.id,
    fullName: data.Username,
    avatar: data.Avatar,
  };
  let currentPath = "/app/";
  if (!!matchPath("/app/all_exams/*", location.pathname)) {
    currentPath = "/app/all_exams/".concat(userInfo.id);
  } else if (!!matchPath("/app/practice_tests/*", location.pathname)) {
    currentPath = "/app/practice_tests";
  }
  return (
    <Root>
      <AppFrame>
        <AppBar {...props} open={open} className="MobileAppBar">
          {/* <Typography
            variant="h6"
            color="inherit"
            className={classes.title}
            id="react-admin-title"
          /> */}
          {isLargeEnough && (
            <img src={logo2} alt="logo" className={classes.logo} />
          )}

          <span className={classes.spacer} />
        </AppBar>

        <AppBar1
          position="fixed"
          sx={{ bgcolor: "#2196f3" }}
          className="DesktopAppBar"
        >
          <Toolbar variant="dense">
            <Box flex={1} display="flex" justifyContent="space-between">
              <Box display="flex" alignItems="center">
                {isLargeEnough && (
                  <Box
                    component="img"
                    src={logo2}
                    alt="StudyAll Logo"
                    className={classes.logo}
                  />
                )}
              </Box>
              <Box>
                <Tabs
                  value={currentPath}
                  aria-label="Navigation Tabs"
                  indicatorColor="secondary"
                  textColor="inherit"
                >
                  {() => {
                    console.log("all_exams/".concat(userInfo.id));
                  }}
                  <Tab
                    label={"Dashboard"}
                    component={Link}
                    to="/app"
                    value="/app"
                    className={classes.label}
                  />
                  <Tab
                    label={"Create test"}
                    component={Link}
                    to={"/app/all_exams/".concat(userInfo.id)}
                    value={"/app/all_exams/".concat(userInfo.id)}
                    className={classes.label}
                  />
                  <Tab
                    label={"Practice test"}
                    component={Link}
                    to="/app/practice_tests"
                    value="/app/practice_tests"
                    className={classes.label}
                  />
                </Tabs>
              </Box>
              <Box display="flex">
                <LoadingIndicator
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />
                <UserMenu {...props} className={classes.logo1}>
                  <ProfileMenu />
                  <Logout />
                </UserMenu>
              </Box>
            </Box>
          </Toolbar>
        </AppBar1>

        <ContentWithSidebar>
          <Sidebar className="MobileAppBar">
            <Menu hasDashboard={true} sx={{ marginTop: "48px" }} />
          </Sidebar>
          <Content>{children}</Content>
        </ContentWithSidebar>
      </AppFrame>
    </Root>
  );
};

MyLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  dashboard: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  title: PropTypes.string.isRequired,
};

export default withStyles(styles)(MyLayout);
