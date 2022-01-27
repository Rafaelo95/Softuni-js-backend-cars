module.exports = {
  notFound(req, res) {
    res.render("404.hbs", {title: "Error 404"});
  },
};
