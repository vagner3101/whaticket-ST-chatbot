import React, { useEffect, useReducer, useState } from "react";

import openSocket from "socket.io-client";

import {
    Button,
    IconButton,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import BotModal from "../../components/CommandModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import MenuModal from "../../components/MenuModal";

const useStyles = makeStyles((theme) => ({
    mainPaper: {
        flex: 1,
        padding: theme.spacing(1),
        overflowY: "scroll",
        ...theme.scrollbarStyles,
    },
    customTableCell: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
}));

const reducer = (state, action) => {
    if (action.type === "LOAD_BOTS") {
        const bots = action.payload;
        const newBots = [];

        bots.forEach((bot) => {
            const botIndex = state.findIndex((q) => q.id === bot.id);
            if (botIndex !== -1) {
                state[botIndex] = bot;
            } else {
                newBots.push(bot);
            }
        });

        return [...state, ...newBots];
    }

    if (action.type === "UPDATE_BOTS") {
        const bot = action.payload;
        const botIndex = state.findIndex((u) => u.id === bot.id);

        if (botIndex !== -1) {
            state[botIndex] = bot;
            return [...state];
        } else {
            return [...state,bot];
        }
    }

    if (action.type === "DELETE_BOT") {
        const botId = action.payload;
        console.log('BOTID => ', botId);
        const botIndex = state.findIndex((q) => q.id === botId);
        if (botIndex !== -1) {
            state.splice(botIndex, 1);
        }
        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

const Bots = () => {
    const classes = useStyles();

    const [bots, dispatch] = useReducer(reducer, []);
    const [loading, setLoading] = useState(false);

    const [botModalOpen, setBotModalOpen] = useState(false);
    const [menuModalOpen, setMenuModalOpen] = useState(false);
    const [selectedBot, setSelectedBot] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await api.get("/bot");
                dispatch({ type: "LOAD_BOTS", payload: data });
                setLoading(false);
            } catch (err) {
                toastError(err);
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

        socket.on("bot", (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_BOTS", payload: data.bot });
            }

            if (data.action === "delete") {
                console.log('ACTION DELETE =>', data);
                dispatch({ type: "DELETE_BOT", payload: data.botId });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOpenMenuModal = () => {
        setMenuModalOpen(true);
    };

    const handleCloseMenuModal = () => {
        setMenuModalOpen(false);
    };

    const handleOpenBotModal = () => {
        setBotModalOpen(true);
        setSelectedBot(null);
    };

    const handleCloseBotModal = () => {
        setBotModalOpen(false);
        setSelectedBot(null);
    };

    const handleEditBot = (bot) => {
        setSelectedBot(bot);
        setBotModalOpen(true);
    };

    const handleCloseConfirmationModal = () => {
        setConfirmModalOpen(false);
        setSelectedBot(null);
    };

    const handleDeleteBot = async (botId) => {
        try {
            await api.delete(`/bot/${botId}`);
            toast.success(`${i18n.t("bots.messages.deleted")}`);
        } catch (err) {
            toastError(err);
        }
        setSelectedBot(null);
    };

    return (
        <MainContainer>
            <ConfirmationModal
                title={
                    selectedBot &&
                    `${i18n.t("bots.confirmationModal.deleteTitle")} ${selectedBot.commandBot
                    }?`
                }
                open={confirmModalOpen}
                onClose={handleCloseConfirmationModal}
                onConfirm={() => handleDeleteBot(selectedBot.id)}
            >
                {i18n.t("bots.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <BotModal
                open={botModalOpen}
                onClose={handleCloseBotModal}
                commandId={selectedBot?.id}
            />
            <MenuModal
                open={menuModalOpen}
                onClose={handleCloseMenuModal}
                data={bots}
            />
            <MainHeader>
                <Title>{i18n.t("bots.title")}</Title>
                <MainHeaderButtonsWrapper>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleOpenMenuModal}
                    >
                        {i18n.t("bots.buttons.hierarchy")}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenBotModal}
                    >
                        {i18n.t("bots.buttons.add")}
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>
            <Paper className={classes.mainPaper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">
                                {i18n.t("bots.table.commandBot")}
                            </TableCell>
                            <TableCell align="center">
                                {i18n.t("bots.table.commandType")}
                            </TableCell>
                            <TableCell align="center">
                                {i18n.t("bots.table.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {bots.map((bot) => (
                                <TableRow key={bot.id}>
                                    <TableCell align="left">{bot.commandBot}</TableCell>
                                    <TableCell align="center">

                                        {bot.commandType == '1' ? 'Informativo' :
                                            bot.commandType == '2' ? 'Menu' :
                                                bot.commandType == '3' ? 'Setor' :
                                                    bot.commandType == '4' ? 'Atendente' :
                                                        'Erro'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditBot(bot)}
                                        >
                                            <Edit />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSelectedBot(bot);
                                                setConfirmModalOpen(true);
                                            }}
                                        >
                                            <DeleteOutline />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {loading && <TableRowSkeleton columns={3} />}
                        </>
                    </TableBody>
                </Table>
            </Paper>
        </MainContainer>
    );
};

export default Bots;
