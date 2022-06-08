import { Op } from "sequelize";
import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Bot from "../../models/Bot";
import ShowBotService from "./ShowBotService";

interface BotData {
  commandBot: string;
  commandType: string;
  descriptionBot?: string;
  queueId?: number;
  showMessage?: string;
  userId?: number;
}

const UpdateBotService = async (
  botId: number | string,
  botData: BotData
): Promise<Bot> => {
  const {
    commandBot,
    commandType,
    descriptionBot,
    queueId,
    showMessage,
    userId
  } = botData;
  console.log("botData => ", botData);
  const botSchema = Yup.object().shape({
    commandBot: Yup.string().required("ERR_BOT_INVALID_COMMAND"),
    commandType: Yup.string().required("ERR_BOT_INVALID_TYPE"),
    // queueId: Yup.number().default(null),
    showMessage: Yup.string()
    // userId: Yup.number().default(null)
  });

  try {
    await botSchema.validate({
      commandBot,
      commandType,
      descriptionBot,
      queueId,
      showMessage,
      userId
    });
  } catch (err) {
    throw new AppError(err.message);
  }

  const queue = await ShowBotService(botId);

  await queue.update(botData);

  return queue;
};

export default UpdateBotService;
