const fs = require("fs/promises");
const Car = require("../models/Car");

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

function carViewModel(car) {
  return {
    id: car._id,
    name: car.name,
    description: car.description,
    imageUrl: car.imageUrl,
    price: car.price,
  };
}

async function getAll(query) {
  // https://stackoverflow.com/questions/65822312/solved-handlebars-access-has-been-denied-to-resolve-the-property-name-becaus
  const cars = await Car.find({});
  return cars.map((car) => carViewModel(car));

  /*
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
  */
}

async function getById(id) {
  const car = await Car.findById(id);
  if (car) {
    return carViewModel(car);
  } else {
    return undefined;
  }
  /*
  const data = await read();
  const car = data[id];

  if (car) {
    return Object.assign({}, { id }, car);
  } else {
    return undefined;
  }
  */
}

async function createCar(car) {
  const result = new Car(car);
  await result.save();
  /*
  const cars = await read();
  let id = nextId();
  cars[id] = car;

  await write(cars);
  */
}

function nextId() {
  return "xxxxxxxx-xxxx".replace(/x/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}

async function deleteById(id) {
  const data = await read();

  if (data.hasOwnProperty(id)) {
    delete data[id];
    await write(data);
  } else {
    throw new Error("No such ID in database");
  }
}

async function updateById(id, car) {
  const data = await read();

  if (data.hasOwnProperty(id)) {
    data[id] = car;
    await write(data);
  } else {
    throw new Error("No such ID in database");
  }
}

module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById,
    createCar,
    deleteById,
    updateById,
  };
  next();
};
