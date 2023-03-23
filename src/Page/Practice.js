import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Style/PracticeStyle.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import { RichTextInput } from "ra-input-rich-text";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import ButtonGroup from "@mui/material/ButtonGroup";
import axios from "axios";
import {
    List,
    Datagrid,
    Toolbar,
    Edit,
    SimpleForm,
    DateField,
    TextField,
    EditButton,
    BooleanField,
    NumberField,
    useCreate,
    useNotify,
    useRefresh,
    useRedirect,
    ShowButton,
    ListButton,
    TopToolbar,
    SimpleList,
} from "react-admin";
const PostEditActions = () => (
    <TopToolbar>
        {/* <ShowButton /> */}
        {/* <ListButton /> */}
    </TopToolbar>
);
export const PracticeList = () => (
    <List actions={<PostEditActions />} xs={{ maxWidth: 1280 }} sx={{ margin: "0 auto" }}>
        <Datagrid bulkActionButtons={false}>
            <NumberField source="id" />
            <TextField source="Name" />
            <DateField source="Created_Date" />
            <DateField source="Last_Modified_Date" />
            <BooleanField source="Is_split" />
            <NumberField source="User_id" />
            <EditButton label="PRACTICE" />
        </Datagrid>
    </List>
);