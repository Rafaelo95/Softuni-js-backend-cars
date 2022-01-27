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
    await fs.writeFile("./services/data.json", JSON.stringify(data, null, 2));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

async function getAll(query) {
  const data = await read();
  let cars = Object
    .entries(data)
    .map(([id, value]) => Object.assign({}, { id }, value)
  );

  // console.log(query.search);

  if (query.search) {
    cars = cars.filter(c => c.name.toLocaleLowerCase().includes(query.search.toLocaleLowerCase()));
  }
  if (query.from) {
    cars = cars.filter(c => c.price >= Number(query.from));
  }
  if (query.to) {
    cars = cars.filter(c => c.price <= Number(query.to));
  }

  return cars;
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

async function createCar(car) {
  const cars = await read();
  let id = nextId();
  cars[id] = car;

  await write(cars);
}

function nextId() {
  return "xxxxxxxx-xxxx".replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById,
    createCar,
  };
  next();
};
