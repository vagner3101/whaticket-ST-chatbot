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

const QueueSelectSingle = () => {
    const classes = useStyles();
    const [queues, setQueues] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/queue");
                //console.log('Queue => ', data);
                //console.log('Queue Type => ', typeof (data));
                setQueues(data);
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
                <InputLabel id="queue-selection-input-label">
                    {i18n.t("queueSelect.inputLabel")}
                </InputLabel>

                <Field
                    as={Select}
                    label={i18n.t("queueSelect.inputLabel")}
                    name="queueId"
                    labelId="queue-selection-label"
                    id="queue-selection"
                >
                    {queues.map(queue => (
                        <MenuItem key={queue.id} value={queue.id}>
                            {queue.name}
                        </MenuItem>
                    ))}
                </Field>

            </FormControl>
        </div>
    );
};

export default QueueSelectSingle;
