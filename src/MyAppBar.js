import * as React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@mui/material/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

import logo from './Images/logo.jpg';
const useStyles = makeStyles({
    title: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        marginLeft: -10
    },
    spacer: {
        flex: 1,
    },
    logo: {
        maxWidth: "40px",
        marginLeft: -35
    },
});
const MyAppBar = (props) => {
    const classes = useStyles();
    return (
        <AppBar
            sx={{
                "& .RaAppBar-title": {
                    flex: 1,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                },
            }}
            {...props}
        >
            <Toolbar>
                <img src={logo} alt="logo" className={classes.logo} />
            </Toolbar>
            <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
            >StudyALL</Typography>
            <Typography
                variant="h6"
                color="inherit"
                className={classes.title}
                id="react-admin-title"
            />
            <span className={classes.spacer} />
        </AppBar>
    );
};
export default MyAppBar;