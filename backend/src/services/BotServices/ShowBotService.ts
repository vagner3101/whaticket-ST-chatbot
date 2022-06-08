import AppError from "../../errors/AppError";
import Bot from "../../models/Bot";
import Queue from "../../models/Queue";
import User from "../../models/User";

const ShowBotService = async (botId: number | string): Promise<Bot> => {
  const bot = await Bot.findByPk(botId, {
    include: [
      { model: Queue, as: "queue", attributes: ["id", "name"] },
      { model: User, as: "user", attributes: ["id", "name"] }
    ]
  });

  if (!bot) {
    throw new AppError("ERR_BOT_NOT_FOUND");
  }

  return bot;
};

export default ShowBotService;
