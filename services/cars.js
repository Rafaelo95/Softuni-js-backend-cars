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
  return Object.entries(data).map(([id, value]) =>
    Object.assign({}, { id }, value)
  );
}

async function getById(id) {
  const data = await read();
  const car = data[id];

  if (car) {
    return Object.assign({}, { id }, car);
  } else {
    return undefined;
  }
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById
  };
  next();
};
