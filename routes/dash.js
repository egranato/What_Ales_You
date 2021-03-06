const passport = require('passport');
const db = require("../db");
const router = require("express").Router();
const bodyParser = require('body-parser');
require("../passport");

function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

function adminRequired(req, res, next) {
  if (!req.user.is_admin) {
    return res.render("403");
  }
  next();
}

router
  .use(bodyParser.json())
  .get("/", loginRequired, (req, res, next) => {
    db("tasting")
    .select(["beer.name as name", "beer.abv as abv", "tasting.beer_rating as beer_rating", "tasting.date as date", "brewery.name as brewery"])
    .where("user_id", req.user.id)
    .innerJoin("brewery", function() {
      this.on('tasting.brewery_id', '=', 'brewery.id')
    })
    .innerJoin("beer", function() {
      console.log(req.user.id)
      this.on('tasting.beer_id', '=', 'beer.id')
    })
    .then((beers) => {
      console.log(beers);
      res.render("dash", {
        beers,})
    }, next)
  })

module.exports = router;
