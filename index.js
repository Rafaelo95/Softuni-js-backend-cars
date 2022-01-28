// [x] initialize and configure Express app
// [x] apply initialize templating library
// [x] create home controller
// [x] bind routing
// [x] create layout
// create data service
// - [x] read all
// - [x] read by id
// - [x] create
// - [x] edit
// - [x] delete
// - [x] search
// - [ ] accessory read
// - [ ] accessory create
// - [ ] attach accessory
// implement controllers
// - [x] home
// - [x] details
// - [x] create
// - [x] about
// - [ ] create accessory
// - [ ] attach accessory to a car
// - [ ] update details to include accessories
// [ ] add database connection
// [ ] create Car model
// [ ] upgrade car service to use Car model
// [ ] create Accessory model

const express = require("express");
const hbs = require("express-handlebars");

const initDb = require("./models/index");

const carsService = require("./services/cars");

// controllers
const { about } = require("./controllers/about");
const { details } = require("./controllers/details");
const { home } = require("./controllers/home");
const { notFound } = require("./controllers/notFound");
const create = require("./controllers/create");
const deleteCar = require("./controllers/delete");
const editCar = require("./controllers/edit");

start();

async function start() {

  await initDb();

  // express config
  const app = express();
  app.engine(
    "hbs",
    hbs.create({
      extname: ".hbs",
    }).engine
  );
  app.use(express.urlencoded({ extended: true }));
  app.use("/static", express.static("static"));
  app.use(carsService());

  // routing
  app.get("/", home);
  app.get("/about", about);
  app.route("/create").get(create.get).post(create.post);
  app.route("/delete/:id").get(deleteCar.get).post(deleteCar.post);
  app.route("/edit/:id").get(editCar.get).post(editCar.post);
  app.get("/details/:id", details);
  app.all("*", notFound);

  app.listen(3000, () => console.log("Server started on port 3000"));
}
