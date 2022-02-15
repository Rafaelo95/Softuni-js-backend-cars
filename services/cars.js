const Car = require("../models/Car");

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
  console.log(query);
  // https://stackoverflow.com/questions/65822312/solved-handlebars-access-has-been-denied-to-resolve-the-property-name-becaus

  const options = {};

  if (query.search) {
    options.name = new RegExp(query.search, "i");
  }
  if (query.from) {
    options.price = { $gte: Number(query.from) };
  }
  if (query.to) {
    if (!options.price) {
      options.price = {};
    }

    options.price.$lte = Number(query.to);
  }

  const cars = await Car.find(options);

  return cars.map((car) => carViewModel(car));
}

async function getById(id) {
  const car = await Car.findById(id);
  if (car) {
    return carViewModel(car);
  } else {
    return undefined;
  }
}

async function createCar(car) {
  const result = new Car(car);
  await result.save();
}

async function deleteById(id) {
  await Car.findByIdAndDelete(id);
}

async function updateById(id, car) {
  await Car.findByIdAndUpdate(id, car);
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
