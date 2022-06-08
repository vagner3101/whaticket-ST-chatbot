import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import CreateBotService from "../services/BotServices/CreateBotService";
import DeleteBotService from "../services/BotServices/DeleteBotService";
import ListBotsService from "../services/BotServices/ListBotsService";
import ShowBotService from "../services/BotServices/ShowBotService";
import UpdateBotService from "../services/BotServices/UpdateBotService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const bots = await ListBotsService();

  return res.status(200).json(bots);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    commandBot,
    commandType,
    descriptionBot,
    queueId,
    showMessage,
    userId
  } = req.body;

  const bot = await CreateBotService({
    commandBot,
    commandType,
    descriptionBot,
    queueId,
    showMessage,
    userId
  });

  const io = getIO();
  io.emit("bot", {
    action: "update",
    bot
  });

  return res.status(200).json(bot);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { botId } = req.params;

  const bot = await ShowBotService(botId);

  return res.status(200).json(bot);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { botId } = req.params;

  const bot = await UpdateBotService(botId, req.body);

  const io = getIO();
  io.emit("bot", {
    action: "update",
    bot
  });

  return res.status(201).json(bot);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { botId } = req.params;

  await DeleteBotService(botId);

  const io = getIO();
  io.emit("bot", {
    action: "delete",
    botId: +botId
  });

  return res.status(200).send();
};
