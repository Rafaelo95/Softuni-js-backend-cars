const mongoose = require("mongoose");

require("./Car");

const connectionString = "mongodb://localhost:27017/carbicle";

async function init() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

  } catch (err) {
    console.log("Error connecting to database" + err.message);
    process.exit(1);
  }
}

module.exports = init;
