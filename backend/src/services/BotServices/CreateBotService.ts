import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Bot from "../../models/Bot";

interface BotData {
  commandBot: string;
  commandType: string;
  descriptionBot?: string;
  queueId?: number;
  showMessage?: string;
  userId?: number;
}

const CreateBotService = async (botData: BotData): Promise<Bot> => {
  const {
    commandBot,
    commandType,
    descriptionBot,
    queueId,
    showMessage,
    userId
  } = botData;

  const botSchema = Yup.object().shape({
    commandBot: Yup.string()
      .required("ERR_BOT_INVALID_COMMAND")
      .test(
        "Check-unique-command",
        "ERR_BOT_COMMAND_ALREADY_EXISTS",
        async value => {
          if (value) {
            const botWithSameCommand = await Bot.findOne({
              where: { commandBot: value }
            });

            return !botWithSameCommand;
          }
          return false;
        }
      ),
    commandType: Yup.string().required("ERR_BOT_INVALID_TYPE")
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

  const queue = await Bot.create(botData);

  return queue;
};

export default CreateBotService;
