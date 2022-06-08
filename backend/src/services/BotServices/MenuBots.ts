import ShowBotsService from "../WhatsappService/ShowBotsService";

const ConstructMenu = async () => {
  const bots = await ShowBotsService();
  let options = "";
  bots.forEach((bot, index) => {
    if (bot.commandBot.indexOf(".") === -1) {
      switch (bot.commandType) {
        case 1:
          options += `*${bot.commandBot}* - ${bot.descriptionBot}\n`;
          break;
        case 2:
          options += `*${bot.commandBot}* - ${bot.descriptionBot}\n`;
          break;
        case 3:
          options += `*${bot.commandBot}* - ${bot.queue.name}\n`;
          break;
        case 4:
          options += `*${bot.commandBot}* - ${bot.user.name}\n`;
          break;
      }
    }
  });
  return options;
};

export { ConstructMenu };
