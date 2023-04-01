import * as React from 'react';
import { useEffect } from 'react';
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
} from '@mui/material';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import BackIcon from '@material-ui/icons/ArrowBack';
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
} from 'react-admin';
import logo from './Images/logo.jpg';
import { Link, matchPath, useLocation } from 'react-router-dom';
const styles = {
    title: {
        // flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        width: '150px',
    },
    spacer: {
        flex: 1,
    },
    logo: {
        width: "auto",
        height: "48px",
        marginRight: "1em",
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



const MyLayout = ({
    children,
    dashboard,
    title,
    classes,
    ...props
}) => {
    const [open] = useSidebarState();
    const theme = useTheme();
    const isLargeEnough = useMediaQuery(theme.breakpoints.up('sm'));
    const location = useLocation();

    let currentPath = '/';
    if (!!matchPath('/all_exams/*', location.pathname)) {
        currentPath = '/all_exams';
    } else if (!!matchPath('/practice_tests/*', location.pathname)) {
        currentPath = '/practice_tests';
    }
    return (
        <Root>
            <AppFrame>
                <AppBar
                    {...props}
                    open={open}
                    className="MobileAppBar"
                >
                    <Typography
                        variant="h6"
                        color="inherit"
                        className={classes.title}
                        id="react-admin-title"
                    />
                    {isLargeEnough && <img src={logo} alt="logo" className={classes.logo} />}

                    <span className={classes.spacer} />
                </AppBar>

                <AppBar1 position="fixed" sx={{ bgcolor: "#2196f3" }} className="DesktopAppBar">
                    <Toolbar variant="dense">
                        <Box flex={1} display="flex" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                                {isLargeEnough && <Box
                                    component="img"
                                    src={logo}
                                    alt="StudyAll Logo"
                                    className={classes.logo}
                                />}
                            </Box>
                            <Box>
                                <Tabs
                                    value={currentPath}
                                    aria-label="Navigation Tabs"
                                    indicatorColor="secondary"
                                    textColor="inherit"

                                // variant="h6"
                                >
                                    <Tab
                                        label={'Dashboard'}
                                        component={Link}
                                        to="/"
                                        value="/"
                                        className={classes.label}
                                    />
                                    <Tab
                                        label={'Create test'}
                                        component={Link}
                                        to="/all_exams"
                                        value="/all_exams"
                                        className={classes.label}
                                    />
                                    <Tab
                                        label={'Practice test'}
                                        component={Link}
                                        to="/practice_tests"
                                        value="/practice_tests"
                                        className={classes.label}
                                    />
                                </Tabs>
                            </Box>
                            <Box display="flex">
                                <LoadingIndicator
                                    sx={{
                                        '& .RaLoadingIndicator-loader': {
                                            marginTop: 2,
                                        },
                                    }}
                                />
                                <UserMenu>
                                    <Logout />
                                </UserMenu>
                            </Box>
                        </Box>
                    </Toolbar>
                </AppBar1>

                <ContentWithSidebar>
                    <Sidebar className="MobileAppBar">
                        <Menu hasDashboard={dashboard} />
                    </Sidebar>
                    {/* <Container sx={{ maxWidth: 1200 }}> */}
                    <Content>
                        {children}
                    </Content>
                    {/* </Container> */}
                </ContentWithSidebar>

                {/* <Content className="DesktopAppBar">
                    {children}
                </Content> */}

            </AppFrame>
        </Root >
    );
};

MyLayout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    dashboard: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
    ]),
    title: PropTypes.string.isRequired,
};

export default withStyles(styles)(MyLayout);