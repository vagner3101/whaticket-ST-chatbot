import React, { useEffect, useState } from "react";
import { Field } from "formik";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

const UserSelect = () => {
    const classes = useStyles();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/users");
                setUsers(data.users);
            } catch (err) {
                toastError(err);
            }
        })();
    }, []);

    return (
        <div style={{ marginTop: 6 }}>
            <FormControl
                variant="outlined"
                className={classes.FormControl}
                margin="dense"
                fullWidth
            >
                <InputLabel id="user-selection-input-label">
                    {i18n.t("botModal.form.userId")}
                </InputLabel>

                <Field
                    as={Select}
                    label={i18n.t("botModal.form.userId")}
                    name="userId"
                    labelId="user-selection-label"
                    id="user-selection"
                >
                    {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                            {user.name}
                        </MenuItem>
                    ))}
                </Field>

            </FormControl>
        </div>
    );
};

export default UserSelect;
