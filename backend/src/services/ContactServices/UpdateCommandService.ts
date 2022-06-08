import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";

interface Request {
  number: string;
  isGroup: boolean;
  commandBot?: string;
}

const UpdateCommandService = async ({
  number: rawNumber,
  isGroup,
  commandBot = ""
}: Request): Promise<Contact> => {
  const number = isGroup ? rawNumber : rawNumber.replace(/[^0-9]/g, "");

  const io = getIO();
  let contact: Contact | null;

  contact = await Contact.findOne({ where: { number } });

  if (contact) {
    contact.update({ commandBot: commandBot });

    io.emit("contact", {
      action: "update",
      contact
    });
  } else {
    // aparentemente NUNCA vai cair aqui... depois resolvo isso ....
    contact = await Contact.create({
      number,
      commandBot,
      isGroup
    });

    io.emit("contact", {
      action: "create",
      contact
    });
  }

  return contact;
};

export default UpdateCommandService;
