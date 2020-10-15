const router = require("express").Router();
const passport = require("passport");

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user"],
  })
);

// callback route for github to redirect to
// hand control to passport to use code to grab profile info
router.get("/github/redirect", passport.authenticate("github"), (req, res) => {
  // res.send(req.user);
  res.redirect("/profile");
});

module.exports = router;
