import React from "react";
import {
  Tabs,
  Tab,
  Toolbar,
  AppBar,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, matchPath, useLocation } from "react-router-dom";
// import { UserMenu, Logout, LoadingIndicator } from 'react-admin';
// import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
// import ModeEditOutlineTwoToneIcon from '@mui/icons-material/ModeEditOutlineTwoTone';
const Header = () => {
  const location = useLocation();

  let currentPath = "/";
  if (!!matchPath("/contacts/*", location.pathname)) {
    currentPath = "/contacts";
  } else if (!!matchPath("/companies/*", location.pathname)) {
    currentPath = "/companies";
  } else if (!!matchPath("/deals/*", location.pathname)) {
    currentPath = "/deals";
  }
  const theme = useTheme();
  const isLargeEnough = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box component="nav" sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar variant="dense">
          <Box flex={1} display="flex" justifyContent="space-between">
            <Box>
              <Tabs
                value={currentPath}
                aria-label="Navigation Tabs"
                indicatorColor="secondary"
                textColor="inherit"
              >
                <Tab label={"Dashboard"} component={Link} to="/" value="/" />
                <Tab
                  label={"Contacts"}
                  component={Link}
                  to="/contacts"
                  value="/contacts"
                />
                <Tab
                  label={"Companies"}
                  component={Link}
                  to="/companies"
                  value="/companies"
                />
              </Tabs>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;

// hiện ko dùng tới
