import bcrypt from "bcrypt";

const password = "008080";
const saltRounds = 9;

const generateHash = async () => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Your Raw Password:", password);
  console.log("Your Hashed Password:", hashedPassword);
};

generateHash();

// node hash.js
