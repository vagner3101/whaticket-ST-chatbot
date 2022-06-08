import Contact from "../../models/Contact";

interface Request {
  number: string;
}

const GetCommandService = async (
  rawNumber: string
): Promise<Contact | null> => {
  const number = rawNumber;

  let contact = await Contact.findOne({ where: { number } });

  return contact;
};

export default GetCommandService;
