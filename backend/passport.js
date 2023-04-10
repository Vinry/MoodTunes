const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } = process.env;

passport.use(
  new SpotifyStrategy(
    {
      clientID: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      callbackURL: SPOTIFY_REDIRECT_URI,
    },
    function (accessToken, refreshToken, expiresIn, profile, done) {
      //TODO: store user profile and tokens
      return done(null, profile);
    }
  )
);

module.exports = passport;
