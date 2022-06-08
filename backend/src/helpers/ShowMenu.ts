import Bot from "../models/Bot";

const ShowMenu = (pattern: string, bots: Bot[]) => {
  // '^1\.5\.[0-9]{1,2}$'
  const array_pattern = pattern.split('.');
  let final_pattern = '^';
  array_pattern.forEach(element => {
    final_pattern += element + '\.';
  });
  final_pattern += '[0-9]{1,2}$';

  let showMenu = '\n';
  let menu = "";
  bots.forEach(bot => {
    menu = bot.commandType === 1
    ? bot.descriptionBot
    : bot.commandType === 2
    ? bot.descriptionBot
    : bot.commandType === 3
    ? bot.queue.name
    : bot.commandType === 4
    ? bot.user.name :
                    'Erro';
    showMenu +=
      bot.commandBot.match(final_pattern)?.length === 1
        ? `*${bot.commandBot.substring(
            bot.commandBot.lastIndexOf(".") + 1
          )}* - ${menu}\n`
        : "";
  });
  return showMenu;
};

export default ShowMenu;
