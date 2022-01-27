const fs = require("fs/promises");

async function read() {
  try {
    const file = await fs.readFile("./services/data.json");
    return JSON.parse(file);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function write(data) {
  try {
    await fs.write("./services/data.json", JSON.stringify(data));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function getAll() {
  const data = await read();
  return Object.entries(data)
    .map(([id, value]) => Object.assign({}, { id }, value));
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll
  };
  next();
};