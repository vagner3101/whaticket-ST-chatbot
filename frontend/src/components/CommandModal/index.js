import React, { useState, useEffect, useRef } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import QueueSelectSingle from "../QueueSelectSingle";
import UserSelect from "../UserSelect";

import { i18n } from "../../translate/i18n";

import api from "../../services/api";
import toastError from "../../errors/toastError";
import CommandTypeSelect from "../CommandTypeSelect";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
}));

const CommandSchema = Yup.object().shape({
	commandBot: Yup.string()
		.min(1, "Muito curto!")
		.max(50, "Muito longo!")
		.required("Obrigatório"),
	commandType: Yup.number(),
});

const CommandModal = ({ open, onClose, commandId }) => {
	const classes = useStyles();

	const initialState = {
		commandBot: "",
		commandType: "",
		descriptionBot: "",
		showMessage: "",
		userId: null,
		queueId: null,
	};

	const [selectedCommandTypeId, setSelectedCommandTypeId] = useState("");
	const [showFields, setShowFields] = useState({ queues: false, users: false, message: false, descriptionBot: false, commandType: "" });
	const [command, setCommand] = useState(initialState);
	const greetingRef = useRef();


	useEffect(() => {
		const fetchCommand = async () => {
			setShowFields({ queues: false, users: false, message: false, descriptionBot: false, commandType: "" });
			//setSelectedCommandTypeId("");
			if (!commandId) return;
			try {
				const { data } = await api.get(`/bot/${commandId}`);
				setCommand(prevState => {
					return { ...prevState, ...data };
				});

				switch (data.commandType) {
					case 1:
						setShowFields({ queues: false, users: false, message: true, descriptionBot: true, commandType: data.commandType });
						break;
					case 2:
						setShowFields({ queues: false, users: false, message: false, descriptionBot: true, commandType: data.commandType });
						break;
					case 3:
						setShowFields({ queues: true, users: false, message: true, descriptionBot: false, commandType: data.commandType });
						break;
					case 4:
						setShowFields({ queues: false, users: true, message: true, descriptionBot: false, commandType: data.commandType });
						break;
				}
			} catch (err) {
				toastError(err);
			}
		};

		fetchCommand();
	}, [commandId, open]);

	const handleClose = () => {
		onClose();
		setCommand(initialState);
	};

	const handleSaveCommand = async values => {
		const commandData = { ...values };
		try {
			commandData.commandType = showFields.commandType;
			console.log('Dados => ', commandData);
			if (commandId) {
				await api.put(`/bot/${commandId}`, commandData);
			} else {
				await api.post("/bot", commandData);
			}
			toast.success(i18n.t("botModal.success"));
		} catch (err) {
			toastError(err);
		}
		handleClose();
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="xs"
				fullWidth
				scroll="paper"
			>
				<DialogTitle id="form-dialog-title">
					{commandId
						? `${i18n.t("botModal.title.edit")}`
						: `${i18n.t("botModal.title.add")}`}
				</DialogTitle>
				<Formik
					initialValues={command}
					enableReinitialize={true}
					validationSchema={CommandSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSaveCommand(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form>
							<DialogContent dividers>
								<div className={classes.multFieldLine}>
									<Field
										as={TextField}
										label={i18n.t("botModal.form.commandBot")}
										autoFocus
										name="commandBot"
										error={touched.commandBot && Boolean(errors.commandBot)}
										helperText={touched.commandBot && errors.commandBot}
										variant="outlined"
										margin="dense"
										fullWidth
									/>
									<CommandTypeSelect
										selectedCommandId={showFields.commandType}
										onChange={values => setShowFields(values)}
									/>
								</div>
								{showFields.descriptionBot && <Field
									as={TextField}
									label={i18n.t("botModal.form.descriptionBot")}
									name="descriptionBot"
									error={touched.descriptionBot && Boolean(errors.descriptionBot)}
									helperText={touched.descriptionBot && errors.descriptionBot}
									variant="outlined"
									margin="dense"
									fullWidth
								/>}
								{showFields.users && <UserSelect />}
								{showFields.queues && <QueueSelectSingle />}
								{showFields.message && <Field
									as={TextField}
									label={i18n.t("botModal.form.showMessage")}
									name="showMessage"
									multiline
									inputRef={greetingRef}
									rows={5}
									fullWidth
									error={touched.showMessage && Boolean(errors.showMessage)}
									helperText={touched.showMessage && errors.showMessage}
									variant="outlined"
									margin="dense"
								/>}
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									disabled={isSubmitting}
									variant="outlined"
								>
									{i18n.t("botModal.buttons.cancel")}
								</Button>
								<Button
									type="submit"
									color="primary"
									disabled={isSubmitting}
									variant="contained"
									className={classes.btnWrapper}
								>
									{commandId
										? `${i18n.t("botModal.buttons.okEdit")}`
										: `${i18n.t("botModal.buttons.okAdd")}`}
									{isSubmitting && (
										<CircularProgress
											size={24}
											className={classes.buttonProgress}
										/>
									)}
								</Button>
							</DialogActions>
						</Form>
					)}
				</Formik>
			</Dialog>
		</div>
	);
};

export default CommandModal;
