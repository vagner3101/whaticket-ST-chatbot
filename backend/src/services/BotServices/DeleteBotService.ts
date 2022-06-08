import ShowBotService from "./ShowBotService";

const DeleteBotService = async (botId: number | string): Promise<void> => {
  const bot = await ShowBotService(botId);

  await bot.destroy();
};

export default DeleteBotService;
