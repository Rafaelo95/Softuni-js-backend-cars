module.exports = {
  async home(req, res) {
    // console.log(req.query);
    const cars = await req.storage.getAll(req.query);
    // console.log(cars);
    res.render("index.hbs", { cars, title: "Cars", query: req.query });
  },
};
