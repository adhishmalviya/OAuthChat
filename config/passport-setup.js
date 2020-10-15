const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      // options for github strategy
      clientID: keys.github.clientID,
      clientSecret: keys.github.clientSecret,
      callbackURL: "/auth/github/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // check if user already exists in our own db
      //   console.log(profile);
      User.findOne({ githubId: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have this user
          console.log("user is: ", currentUser);
          done(null, currentUser);
        } else {
          // if not, create user in our db
          new User({
            githubId: profile._json.id,
            username: profile._json.name,
            thumbnail: profile._json.avatar_url,
            // username: "Mamta",
            // thumbnail: "SomeURL",
          })
            .save()
            .then((newUser) => {
              console.log("created new user: ", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
