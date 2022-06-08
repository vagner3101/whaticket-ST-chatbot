// import React, { useState } from "react";
import React from "react";
import { Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const CommandTypeSelect = ({ selectedCommandId, onChange }) => {
    const classes = useStyles();
    //const [comando, setComando] = useState({ selectedCommandId });

    const handleChange = e => {
        //setComando(e.target.value);
        onChange(
            e.target.value === '1' ? { queues: false, users: false, message: true, descriptionBot: true, commandType: e.target.value } :
                e.target.value === '2' ? { queues: false, users: false, message: false, descriptionBot: true, commandType: e.target.value } :
                    e.target.value === '3' ? { queues: true, users: false, message: true, descriptionBot: false, commandType: e.target.value } :
                        e.target.value === '4' ? { queues: false, users: true, message: true, descriptionBot: false, commandType: e.target.value } :
                            { queues: false, users: false, message: false, descriptionBot: false, commandType: "" }
        );
    };
    return (
        <div style={{ marginTop: 6 }}>
            <FormControl
                variant="outlined"
                className={classes.formControl}
                margin="dense"
            >
                <InputLabel id="profile-selection-input-label">
                    {i18n.t("botModal.form.commandType")}
                </InputLabel>

                <Field
                    as={Select}
                    label={i18n.t("botModal.form.commandType")}
                    name="commandType"
                    labelId="profile-selection-label"
                    id="profile-selection"
                    required
                    value={selectedCommandId}
                    onChange={handleChange}
                >
                    <MenuItem key="1" value="1">Informativo</MenuItem>
                    <MenuItem key="2" value="2">Menu</MenuItem>
                    <MenuItem key="3" value="3">Setor</MenuItem>
                    <MenuItem key="4" value="4">Atendente</MenuItem>
                </Field>
            </FormControl>
        </div>);
};

export default CommandTypeSelect;